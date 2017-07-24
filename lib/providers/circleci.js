/* eslint-disable */

const creds = require('../../.sodo/cicred.json');
const syncrequest = require('sync-request');
// const opn = require('opn');

class CircleCi {
  constructor() {
    this.resources = ['ci'];
    this.ops = ['add', 'remove', 'onboard', 'offboard', 'summary', 'list', 'usage'];
    this.token = creds.token;
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
    return this.token !== undefined;
  }

  // TODO fix this eslint error
  provide(resourceName, sodoRequest) { // eslint-disable-line class-methods-use-this
    const self = this;
    const args = sodoRequest.arguments;
    const vcstype = args.vcstype;
    const username = args.username;
    const project = args.project;
    // TODO: Implement
    const provider = {
      description: 'Circle CI Continuous Integration',
      vcstype,
      username,
      project,
      label: args.label,
      execute: (request) => {
        if (request.command === 'showissue') {
          return provider.showissue(request);
        } else if (request.command === 'addissue') {
          return provider.addissue(request);
        }
        return provider.list();
      },
      list: () => {
        if (self.credentialsExist()) {
          const path = `https://circleci.com/api/v1.1/project/${vcstype}/${username}/${project}?circle-token=${self.token}`;
          const options = {
            headers: {
              Accept: 'application/json',
            },
          };
          const res = syncrequest('GET', path, options);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const ciResponse = JSON.parse(res.getBody());
            return {
              success: true,
              message: {
                type: 'Circle CI',
                project,
                ciResponse,
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
            type: 'Circle CI',
            project,
          },
          info: 'Credentials were not available',
        };
      },
      getConfig: () => ({
        resource: 'ci',
        properties: {
          type: 'circleci',
          label: args.label,
          description: 'Circle CI Continuous Integration',
          project,
          vcstype,
          username,
        },
      }),
    };

    return provider;
  }
}

module.exports = CircleCi;
