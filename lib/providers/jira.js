/* eslint-disable */

const creds = require('../../.sodo/jiracred.json');
const syncrequest = require('sync-request');
const opn = require('opn');

class Jira {
  constructor() {
    this.resources = ['backlog', 'tickets'];
    this.ops = ['add', 'remove', 'onboard', 'offboard', 'summary', 'list', 'usage'];
    this.creds = creds;
    this.authorization = Buffer.from(`${creds.username}:${creds.password}`).toString('base64');
  }

  getConfig() {
    return this.config;
  }

  canProvide(resourceName) {
    if (this.resources.includes(resourceName)) {
      return true;
    }
    return false;
  }

  credentialsExist() {
    return this.creds.username !== undefined && this.creds.password !== undefined;
  }

  // TODO fix this eslint error
  provide(resourceName, sodoRequest) { // eslint-disable-line class-methods-use-this
    const self = this;
    const args = sodoRequest.arguments;
    const uri = args.instance;
    // TODO: Implement
    const provider = {
      uri,
      description: 'A Jira based-backlog',
      projectKey: args.projectKey,
      label: args.label,
      execute: (request) => {
        if (request.command === 'showissue') {
          return provider.showissue(request);
        } else if (request.command === 'addissue') {
          return provider.addissue(request);
        }
        return provider.list();
      },
      addissue: () => {
        const path = `${uri}/secure/CreateIssue!default.jspa`;
        opn(path, { wait: false });
        return {
          success: true,
        };
      },
      showissue: () => {
        if (self.credentialsExist()) {
          const path = `${uri}/rest/api/2/issue/SODO-29`;
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${self.authorization}`,
            },
          };

          const res = syncrequest('GET', path, options);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            return {
              success: true,
              message: JSON.parse(res.getBody()),
              info: 'Credentials were available',
            };
          }

          return {
            success: false,
            message: {},
            info: 'Credentials were available',
          };
        }

        return {
          success: false,
          message: {},
          info: 'Credentials were not available',
        };
      },
      list: () => {
        if (creds.username !== undefined && creds.password !== undefined) {
          const jql = `project = ${args.projectKey} AND resolution = Unresolved ORDER BY priority DESC, updated DESC`;

          const path = `${uri}/rest/api/2/search`;
          const options = {
            qs: {
              jql,
              maxResults: 3,
            },
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${self.authorization}`,
            },
          };

          const res = syncrequest('GET', path, options);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const jiraResponse = JSON.parse(res.getBody());
            const issues = jiraResponse.issues.map((e) => {
              const sodoIssue = {
                issueKey: e.key,
                title: e.fields.summary,
                priority: e.fields.priority.name,
              };
              return sodoIssue;
            });

            return {
              success: true,
              message: {
                type: 'JIRA',
                projectKey: args.projectKey,
                totalOpenIssues: jiraResponse.total,
                issues,
              },
              info: 'Credentials were available',
            };
          }

          return {
            success: false,
            message: {},
            info: 'Credentials were available.',
          };
        }
        return {
          success: true,
          message: {
            type: 'JIRA',
            projectKey: args.projectKey,
          },
          info: 'Credentials were not available',
        };
      },
      getConfig: () => ({
        resource: 'backlog',
        properties: {
          type: 'jira',
          description: 'A Jira based-backlog',
          projectKey: args.projectKey,
        },
      }),
    };

    return provider;
  }
}

module.exports = Jira;
