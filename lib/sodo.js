const defaultConfig = require('./config');
const defaultRegistry = require('./resource-registry');
const { isEmpty } = require('lodash');

// const sodo = require('./sodo');
// sodo.resources.backlog().show();
// sodo.resources.backlog('jira').init();

let resourceProxy;

function init(config, registry) {
  resourceProxy = resourceType =>
    new Proxy(config.resources[resourceType], {
      get: (target, name) => {
        const spec = Reflect.get(target, name);

        if (!spec) {
          return target[name];
        }

        // Intercept data retrieval, otherwise perform the underlying Array operation.
        if (spec.id !== undefined) {
          const ResourceClass = registry.resources[resourceType][spec.id].class;
          return new ResourceClass(spec);
        }
        return target[name];
      },
      has: (_, name) => {
        const specs = config.resources[resourceType];

        if (!specs) {
          return false;
        }

        return Reflect.has(specs, name);
      },
    });
}

function score() {
  let sodoScore = 0;
  const tests = defaultConfig.resources.test;
  if (!isEmpty(tests)) {
    sodoScore += 1;
  }

  const linters = defaultConfig.resources.lint;
  if (!isEmpty(linters)) {
    sodoScore += 1;
  }

  const builds = defaultConfig.resources.build;
  if (!isEmpty(builds)) {
    sodoScore += 1;
  }

  const logs = defaultConfig.resources.log;
  if (!isEmpty(logs)) {
    sodoScore += 1;
  }

  const forums = defaultConfig.resources.forum;
  if (!isEmpty(forums)) {
    sodoScore += 1;
  }

  const backlogs = defaultConfig.resources.backlog;
  if (!isEmpty(backlogs)) {
    sodoScore += 1;
  }

  return Math.floor(sodoScore / 6 * 100);
}

init(defaultConfig, defaultRegistry);

module.exports = {
  init,
  score,
  resources: {
    get backlog() {
      return resourceProxy('backlog');
    },
    get log() {
      return resourceProxy('log');
    },
    get test() {
      return resourceProxy('test');
    },
    get build() {
      return resourceProxy('build');
    },
    get forum() {
      return resourceProxy('forum');
    },
    get lint() {
      return resourceProxy('lint');
    },
    get project() {
      return resourceProxy('project');
    },
  },
};
