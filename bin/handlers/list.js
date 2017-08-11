/* eslint-disable no-console */

const config = require('../../lib/config');
const analytics = require('../../lib/analytics');
const { sortBy } = require('lodash');

function listHandler(type) {
  return argv => {
    const labels = config.resources[type].map(
      resourceSpec => resourceSpec.label,
    );

    analytics.track({
      event: 'Command',
      properties: {
        command: sortBy(argv._),
        rawCommand: argv._,
        labels,
      },
    });

    labels.forEach(l => console.log(l));
  };
}

module.exports = listHandler;
