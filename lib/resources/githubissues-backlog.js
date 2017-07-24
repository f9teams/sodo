const inquirer = require('inquirer');
const { extend, isEmpty, get } = require('lodash');
const opn = require('opn');
const urljoin = require('url-join');
const log = require('../log');
const { Backlog } = require('../resource');

class GitHubIssuesBacklog extends Backlog {
  init(opts) {
    const questions = [
      {
        type: 'input',
        name: 'owner',
        message: 'GitHub Repository Owner',
        default: get(this.spec, 'config.owner'),
        when: () => isEmpty(opts.owner),
      },
      {
        type: 'input',
        name: 'repository',
        message: 'GitHub Repository Name',
        default: get(this.spec, 'config.repository'),
        when: () => isEmpty(opts.repository),
      },
    ];

    return super.init(opts)
      .then(specConfig => inquirer.prompt(questions)
        .then(({ owner, repository }) => extend(specConfig, { owner, repository }))); // eslint-disable-line max-len
  }

  add() {
    // TODO this needs to open up a create issue page with prepopulated project and issue type
    // default issue type may be able to be read from the JIRA API?
    const path = urljoin('https://github.com', this.spec.config.owner, this.spec.config.repository, 'issues/new');
    log.info({ path }, 'opening GitHub to Create Issue page');
    return opn(path, { wait: false });
  }

  show(opts) {
    const itemId = opts.id;

    if (itemId) {
      const itemPath = urljoin('https://github.com', this.spec.config.owner, this.spec.config.repository, 'issues', itemId);
      log.info({ path: itemPath }, `opening GitHub to ${itemId}`);
      return opn(itemPath, { wait: false });
    }

    const projectPath = urljoin('https://github.com', this.spec.config.owner, this.spec.config.repository, 'issues');
    log.info({ path: projectPath }, 'opening GitHub');
    return opn(projectPath, { wait: false });
  }
}

module.exports = GitHubIssuesBacklog;
