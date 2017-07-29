const {
  Backlog,
  Test,
  Lint,
  Build,
  Project,
  Log,
  Forum,
} = require('./resource');
const JiraBacklog = require('./resources/jira-backlog');
const TrelloBacklog = require('./resources/trello-backlog');
const documentation = require('./resources/documentation');
const localCommand = require('./resources/local-command');
const TravisCIBuild = require('./resources/travisci-build');
const CircleCIBuild = require('./resources/circleci-build');
const GitHubIssuesBacklog = require('./resources/githubissues-backlog');
const GoogleGroupForum = require('./resources/googlegroup-forum');
const SlackChannelForum = require('./resources/slackchannel-forum');

const registry = {
  resources: {
    backlog: {
      jira: { label: 'Atlassian JIRA', class: JiraBacklog },
      trello: { label: 'Trello', class: TrelloBacklog },
      github: { label: 'GitHub Issues', class: GitHubIssuesBacklog },
      command: { label: 'Local Command', class: localCommand(Backlog) },
      documentation: { label: 'Documentation', class: documentation(Backlog) },
    },
    test: {
      command: { label: 'Local Command', class: localCommand(Test) },
      documentation: { label: 'Documentation', class: documentation(Test) },
    },
    lint: {
      command: { label: 'Local Command', class: localCommand(Lint) },
      documentation: { label: 'Documentation', class: documentation(Lint) },
    },
    log: {
      command: { label: 'Local Command', class: localCommand(Log) },
      documentation: { label: 'Documentation', class: documentation(Log) },
    },
    build: {
      travis: { label: 'Travis CI', class: TravisCIBuild },
      circle: { label: 'CircleCI', class: CircleCIBuild },
      command: { label: 'Local Command', class: localCommand(Build) },
      documentation: { label: 'Documentation', class: documentation(Backlog) },
    },
    forum: {
      googleGroup: { label: 'Google Groups', class: GoogleGroupForum },
      slackChannel: { label: 'Slack Channel', class: SlackChannelForum },
      command: { label: 'Local Command', class: localCommand(Forum) },
      documentation: { label: 'Documentation', class: documentation(Forum) },
    },
    project: {
      command: { label: 'Local Command', class: localCommand(Project) },
      documentation: { label: 'Documentation', class: documentation(Project) },
    },
  },
};

module.exports = registry;
