const inquirer = require('inquirer');
const { extend, isEmpty, get, union } = require('lodash');
const urljoin = require('url-join');
const opn = require('opn');
const { Build } = require('../resource');

class CircleCIBuild extends Build {
  static get privateKeys() {
    return union(super.privateKeys, ['token']);
  }

  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'username',
        message: 'Owner Username',
        default: get(this.spec, 'config.username'),
        when: () => isEmpty(opts.username),
      },
      {
        type: 'input',
        name: 'project',
        message: 'Project Key',
        default: get(this.spec, 'config.project'),
        when: () => isEmpty(opts.project),
      },
      {
        type: 'list',
        name: 'vcstype',
        message: 'Project Version Control System',
        choices: ['github', 'bitbucket'],
        default: get(this.spec, 'config.vcstype'),
        when: () => isEmpty(opts.vcstype),
      },
      {
        type: 'input',
        name: 'token',
        message: 'Circle CI Access Token',
        default: get(this.spec, 'config.token'),
        when: () => isEmpty(opts.token),
      },
    ];

    return super.init(opts)
      .then(specConfig => inquirer.prompt(questions)
        .then(({ username, project, vcstype, token }) => extend(specConfig, { username, project, vcstype, private: { token } }))); // eslint-disable-line max-len
  }

  show() {
    const path = urljoin('https://circleci.com/gh', this.spec.config.username, this.spec.config.project);
    return opn(path, { wait: false });
  }
}

module.exports = CircleCIBuild;
