const inquirer = require('inquirer');
const { isEmpty, get, extend } = require('lodash');
const opn = require('opn');
const urljoin = require('url-join');
const log = require('../log');
const { Backlog } = require('../resource');

class JiraBacklog extends Backlog {
  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'url',
        message: 'JIRA URL',
        default: get(this.spec, 'config.url'),
        when: () => isEmpty(opts.url),
      },
      {
        type: 'input',
        name: 'projectKey',
        message: 'JIRA Project Key',
        default: get(this.spec, 'config.projectKey'),
        when: () => isEmpty(opts.projectKey),
      },
    ];

    return super
      .init(opts)
      .then(specConfig =>
        inquirer
          .prompt(questions)
          .then(({ url, projectKey }) =>
            extend(specConfig, { url, projectKey }),
          ),
      );
  }

  add() {
    // TODO this needs to open up a create issue page with prepopulated project and issue type
    // default issue type may be able to be read from the JIRA API?
    const path = urljoin(
      this.spec.config.url,
      'secure/CreateIssue!default.jspa',
    );
    log.info({ path }, 'opening JIRA to Create Issue page');
    return opn(path, { wait: false });
  }

  show(opts) {
    const itemId = opts.id;

    if (itemId) {
      const itemPath = urljoin(this.spec.config.url, 'browse', itemId);
      log.info({ path: itemPath }, `opening JIRA to ${itemId}`);
      return opn(itemPath, { wait: false });
    }

    const projectPath = urljoin(
      this.spec.config.url,
      'browse',
      this.spec.config.projectKey,
    );
    log.info({ path: projectPath }, 'opening JIRA');
    return opn(projectPath, { wait: false });
  }
}

module.exports = JiraBacklog;
