const inquirer = require('inquirer');
const { isEmpty, get, extend } = require('lodash');
const urljoin = require('url-join');
const opn = require('opn');
const { Build } = require('../resource');

class TravisCIBuild extends Build {
  init(opts) {
    const questions = [
      {
        type: 'list',
        name: 'visibility',
        message: 'Project Visibility',
        choices: ['public', 'private'],
        default: get(this.spec, 'config.visibility'),
        when: () => isEmpty(opts.visibility),
      },
      {
        type: 'input',
        name: 'owner',
        message: 'Repository Owner (User Name or Organization)',
        default: get(this.spec, 'config.owner'),
        when: () => isEmpty(opts.owner),
      },
      {
        type: 'input',
        name: 'repository',
        message: 'Repository Name',
        default: get(this.spec, 'config.repository'),
        when: () => isEmpty(opts.repository),
      },
      {
        type: 'input',
        name: 'token',
        message: 'Travis CI Access Token',
        default: get(this.spec, 'config.token'),
        when: () => isEmpty(opts.token),
      },
    ];

    return super.init(opts)
      .then(specConfig => inquirer.prompt(questions)
        .then(({ visibility, owner, repository, token }) => extend(specConfig, { visibility, owner, repository, private: { token } }))); // eslint-disable-line max-len
  }

  show() {
    const url = this.spec.config.visibility === 'public' ? 'https://travis-ci.org' : 'https://travis-ci.com';
    const path = urljoin(url, this.spec.config.owner, this.spec.config.repository);
    return opn(path, { wait: false });
  }
}

module.exports = TravisCIBuild;
