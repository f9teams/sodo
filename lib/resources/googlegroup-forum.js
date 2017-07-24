const inquirer = require('inquirer');
const { extend, isEmpty, get } = require('lodash');
const urljoin = require('url-join');
const opn = require('opn');
const { Forum } = require('../resource');

class GoogleGroupForum extends Forum {
  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'group',
        message: 'Google Group Name',
        default: get(this.spec, 'config.group'),
        when: () => isEmpty(opts.group),
      },
    ];

    return super.init(opts)
      .then(specConfig => inquirer.prompt(questions)
        .then(({ group }) => extend(specConfig, { group })));
  }

  show() {
    const path = urljoin('https://groups.google.com/forum/#!forum', this.spec.config.group);
    return opn(path, { wait: false });
  }
}

module.exports = GoogleGroupForum;
