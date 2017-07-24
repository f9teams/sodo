// TODO consider memoizing config methods for performance reasons, use lodash.memoize
// TODO consider async file operations

const { execSync } = require('child_process');
const yaml = require('js-yaml');
const path = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { keyBy, has, cloneDeep, pick, omit } = require('lodash');

// Using debug instead of bunyan here because this module is used to initialize the log
// module and we have to avoid circular dependencies. If this module causes some sort of
// fatal error it is a very serious bug. Code defensively.
const debug = require('debug')('config');

class NoProject extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

function projectDir() {
  const cmd = 'git rev-parse --show-toplevel';

  try {
    const pd = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    return pd;
  } catch (e) {
    const ex = new NoProject(`Project not found. Current working directory is not a git repository. "${cmd}" failed with message: ${e.message}`);
    debug(ex);
    throw ex;
  }
}

function sodoDir() {
  const pd = projectDir();
  const sd = path.join(pd, '.sodo');
  return sd;
}

function projectPath() {
  const sd = sodoDir();

  if (sd) {
    const pp = path.join(sd, 'project.yml');
    debug(`Project Configuration Path: ${pp}`);
    return pp;
  }

  debug('Project Configuration Path: undefined');
  return undefined;
}

function loadProject() {
  const pp = projectPath();

  if (!existsSync(pp)) {
    debug(`Project Configuration Not Found at ${pp}`);
    return {};
  }

  try {
    debug(`Loading Project Configuration from ${pp}`);
    return yaml.safeLoad(readFileSync(pp, 'utf8')) || {};
  } catch (e) {
    debug(e);
    throw e;
  }
}

function saveProject(projectConfig) {
  const sd = sodoDir();
  const pp = projectPath();
  debug('Saving Project Configuration', { path: pp });
  mkdirp.sync(sd);
  writeFileSync(pp, yaml.safeDump(projectConfig), { encoding: 'utf-8' });
}

function privatePath() {
  const sd = sodoDir();

  if (sd) {
    const pp = path.join(sd, 'private.yml');
    debug(`Private Configuration Path: ${pp}`);
    return pp;
  }

  debug('Private Configuration Path: undefined');
  return undefined;
}

function loadPrivate() {
  const pp = privatePath();

  if (!existsSync(pp)) {
    debug(`Private Configuration Not Found at ${pp}`);
    return {};
  }

  try {
    debug(`Loading Private Configuration from ${pp}`);
    return yaml.safeLoad(readFileSync(pp, 'utf8')) || {};
  } catch (e) {
    debug(e);
    throw e;
  }
}

function savePrivate(privateConfig) {
  const sd = sodoDir();
  const pp = privatePath();
  debug('Saving Private Configuration', { path: pp });
  mkdirp.sync(sd);
  writeFileSync(pp, yaml.safeDump(privateConfig), { encoding: 'utf-8' });
}

function mergeResources(projectConfig, privateConfig) {
  const privateResources = privateConfig.resources;
  if (!privateResources) {
    return;
  }

  if (!projectConfig.resources) {
    projectConfig.resources = {}; // eslint-disable-line no-param-reassign
  }

  const projectResources = projectConfig.resources;

  Object.entries(privateResources).forEach(([resourceType, privateResourceSpecs]) => {
    const labeledProjectResources = keyBy(projectResources[resourceType], 'label');
    privateResourceSpecs.forEach((privateResourceSpec) => {
      const label = privateResourceSpec.label;
      const projectResource = labeledProjectResources[label];
      if (projectResource) {
        projectResource.config.private = privateResourceSpec.config;
      }
    });
  });
}

const mergedConfig = (function mergeConfig() {
  const projectConfig = loadProject();
  const privateConfig = loadPrivate();
  mergeResources(projectConfig, privateConfig);
  return projectConfig || {};
}());
debug('mergedConfig', mergedConfig);

const specsHandler = {
  get: (specs, name) => {
    let spec = Reflect.get(specs, name);
    if (!spec) {
      const labeledSpecs = keyBy(specs, 'label');
      spec = Reflect.get(labeledSpecs, name);
    }
    return spec;
  },
  has: (specs, name) => {
    let hasSpec = Reflect.has(specs, name);
    if (!hasSpec) {
      const labeledSpecs = keyBy(specs, 'label');
      hasSpec = Reflect.has(labeledSpecs, name);
    }
    return hasSpec;
  },
};

function resourceSpecsProxy(resourceType) {
  if (!has(mergedConfig, 'resources')) {
    mergedConfig.resources = {};
  }

  if (!has(mergedConfig.resources, resourceType)) {
    mergedConfig.resources[resourceType] = [];
  }

  const specs = mergedConfig.resources[resourceType];
  return new Proxy(specs, specsHandler);
}

function splitResources(projectConfig, privateConfig) {
  const projectResources = projectConfig.resources;
  if (!projectResources) {
    // TODO I believe this will result in an edge case failure where no project.yaml
    // exists but some resources are defined in private.yaml
    return;
  }

  const privateResources = privateConfig.resources;
  Object.entries(projectResources).forEach(([resourceType, resources]) => {
    if (!has(privateResources, resourceType)) {
      privateResources[resourceType] = [];
    }

    resources.forEach((resource) => {
      const privateResource = cloneDeep(pick(resource, ['label', 'config']));
      privateResource.config = privateResource.config.private;
      if (privateResource.config) {
        privateResources[resourceType].push(privateResource);
      }
      resource.config = omit(resource.config, ['private']); // eslint-disable-line no-param-reassign
    });
  });
}

function splitConfig() {
  const projectConfig = cloneDeep(mergedConfig);
  projectConfig.version = 1;

  const privateConfig = {
    version: projectConfig.version,
    resources: {},
  };

  splitResources(projectConfig, privateConfig);

  return [projectConfig, privateConfig];
}

module.exports = {
  get projectDir() {
    return projectDir();
  },
  get sodoDir() {
    return sodoDir();
  },
  resources: {
    // TODO make generic so this does not have to be repeated per resource type
    get backlog() {
      return resourceSpecsProxy('backlog');
    },
    get test() {
      return resourceSpecsProxy('test');
    },
    get log() {
      return resourceSpecsProxy('log');
    },
    get build() {
      return resourceSpecsProxy('build');
    },
    get forum() {
      return resourceSpecsProxy('forum');
    },
    get lint() {
      return resourceSpecsProxy('lint');
    },
    get project() {
      return resourceSpecsProxy('project');
    },
  },
  save: () => {
    const [projectConfig, privateConfig] = splitConfig(this);
    debug('saving projectConfig', projectConfig);
    saveProject(projectConfig);
    debug('saving privateConfig', privateConfig);
    savePrivate(privateConfig);
  },
};
