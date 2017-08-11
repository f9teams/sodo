/* eslint-disable no-console */

const sodo = require('../../lib/sodo');
const { isEmpty, sortBy } = require('lodash');
const analytics = require('../../lib/analytics');

function verbHandler(type, verb) {
  return argv => {
    const label = argv.label;

    let resource;
    if (isEmpty(label)) {
      resource = sodo.resources[type][0];
    } else {
      resource = sodo.resources[type][label];
    }

    analytics.track({
      event: 'Command',
      properties: {
        command: sortBy(argv._),
        rawCommand: argv._,
        spec: resource.spec,
        label,
      },
    });

    return resource[verb](argv);
  };
}

module.exports = verbHandler;
