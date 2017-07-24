const defaultConfig = require('./config');
const defaultRegistry = require('./resource-registry');

// const sodo = require('./sodo');
// sodo.resources.backlog().show();
// sodo.resources.backlog('jira').init();

let resourceProxy;

function init(config, registry) {
  resourceProxy = resourceType => new Proxy([], {
    get: (_, name) => {
      const specs = config.resources[resourceType];
      const spec = Reflect.get(specs, name);

      if (!spec) {
        return undefined;
      }

      const ResourceClass = registry.resources[resourceType][spec.id].class;
      return new ResourceClass(spec);
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

init(defaultConfig, defaultRegistry);

module.exports = {
  init,
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
