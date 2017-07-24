const { defaults, get, union } = require('lodash');
const inquirer = require('inquirer');

const documentationHandler = {
  get: (target, key) => {
    const verbs = target.constructor.verbs;
    const spec = target.spec;

    if (!Reflect.has(target, key) &&
      Array.prototype.includes.call(verbs, key)) {
      return () => {
        const verbDescription = get(spec, `config.verbDescription.${key}`);
        const resourceDescription = get(spec, 'config.description');
        const description = verbDescription || resourceDescription;
        if (description) {
          console.log(description); // eslint-disable-line no-console
        }
        return description;
      };
    }
    return target[key];
  },
  has: (target, key) => {
    const verbs = target.constructor.verbs;
    return Reflect.has(target, key) || Array.prototype.includes.call(verbs, key);
  },
};

class Resource {
  constructor(spec) {
    this.spec = defaults(spec, { config: {} });
    // returning a proxy allows us to display documentation when a
    // resource does not implement a verb
    return new Proxy(this, documentationHandler);
  }

  // Important that verbs are static so that we can discover what they are
  // given a type/Class reference. If not static an instance reference is
  // required.
  static get verbs() {
    return ['init', 'show', 'list'];
  }

  configure(specConfig) {
    this.spec.config = specConfig;
    return this;
  }

  init(opts) {
    const label = this.spec.label;
    const description = opts.description;

    const questions = [
      {
        type: 'editor',
        name: 'description',
        message: `Enter documentation for ${label}`,
        default: this.spec.config.description,
        when: () => !description,
      },
    ];

    return inquirer.prompt(questions)
      .then(specConfig => defaults(specConfig, { description }));
  }
}

class Backlog extends Resource {
  static get verbs() {
    return union(super.verbs, ['add']);
  }
}

class Build extends Resource {}

class Forum extends Resource {}

class Lint extends Resource {
  static get verbs() {
    return union(super.verbs, ['run']);
  }
}

class Log extends Resource {
  static get verbs() {
    return union(super.verbs, ['tail']);
  }
}

class Test extends Resource {
  static get verbs() {
    return union(super.verbs, ['run']);
  }
}

class Project extends Resource {
  static get verbs() {
    return union(super.verbs, ['build', 'run']);
  }
}

module.exports = {
  Backlog,
  Build,
  Forum,
  Lint,
  Log,
  Test,
  Project,
};
