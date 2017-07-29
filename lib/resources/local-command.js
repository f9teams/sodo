const inquirer = require('inquirer');
const { extend, get } = require('lodash');
const config = require('../config');
const { execSync } = require('child_process');

const localCommandHandler = {
  get: (target, key) => {
    const cmd = get(target, `spec.config.command.${key}`);
    if (cmd) {
      return () => execSync(cmd, { cwd: config.projectDir, stdio: 'inherit' });
    }
    return target[key];
  },
};

function localCommandResource(base) {
  return class extends base {
    constructor(spec) {
      super(spec);
      return new Proxy(this, localCommandHandler);
    }

    init(opts) {
      const verbs = this.constructor.verbs;

      const questions = verbs.map(verb => ({
        type: 'input',
        name: verb,
        message: `Enter the ${verb} command`,
        default: get(this.spec, `config.command.${verb}`),
      }));

      return super
        .init(opts)
        .then(specConfig =>
          inquirer
            .prompt(questions)
            .then(answers => extend(specConfig, { command: answers })),
        );
    }
  };
}

module.exports = localCommandResource;
