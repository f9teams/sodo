/* eslint-disable */

const exec = require('child_process').exec;
const log = require('../util/logger.js');

class Node {
  constructor() {
    this.script = 'npm test'; // default node test command.
  }

  // TODO fix this eslint error
  canProvide(resourceName) { // eslint-disable-line class-methods-use-this
    return resourceName === 'tests';
  }

  // TODO fix this eslint error
  provide(resourceName, sodoRequest) { // eslint-disable-line class-methods-use-this
    const self = this;
    const args = sodoRequest.arguments;
    const NodeProvider = {
      description: args.description,
      label: args.label,
      // TODO fix this eslint error
      execute: (request) => {
        if (request.command === 'run') {
          return NodeProvider.run(request);
        }
        return NodeProvider.list();
      },
      list: () => ({
        success: true,
        message: 'Unit Tests are written in Node.js',
        info: '',
      }),
      run: () => {
        log.info(`Running test script ${self.script}`);
        exec(self.script, (error, stdout, stderr) => {
          log.info(stdout);
          log.error(stderr);
        });
        return {
          success: true,
          message: {},
          info: '',
        };
      },
      getConfig: () => ({
        resource: resourceName,
        properties: {
          type: 'text',
          description: args.description,
          label: args.label,
        },
      }),
    };

    return NodeProvider;
  }
}

module.exports = Node;
