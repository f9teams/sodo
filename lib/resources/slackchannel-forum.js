const inquirer = require('inquirer');
const { extend, isEmpty, get } = require('lodash');
const urljoin = require('url-join');
const opn = require('opn');
const { Forum } = require('../resource');

class SlackChannelForum extends Forum {
  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'domain',
        message: 'Team Domain',
        default: get(this.spec, 'config.domain'),
        when: () => isEmpty(opts.domain),
      },
      {
        type: 'input',
        name: 'channel',
        message: 'Project Channel',
        default: get(this.spec, 'config.channel'),
        when: () => isEmpty(opts.channel),
      },
    ];

    return super
      .init(opts)
      .then(specConfig =>
        inquirer
          .prompt(questions)
          .then(({ domain, channel }) =>
            extend(specConfig, { domain, channel }),
          ),
      );
  }

  show() {
    const path = urljoin(
      this.spec.config.domain,
      'messages',
      this.spec.config.channel,
    );

    return opn(path, { wait: false });
  }
}

module.exports = SlackChannelForum;
