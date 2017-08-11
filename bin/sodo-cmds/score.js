/* eslint-disable no-console */

const sodo = require('../../lib/sodo');
const analytics = require('../../lib/analytics');

module.exports = {
  command: 'score',
  builder: yargs => {
    yargs.option('m', {
      alias: ['min'],
      describe: 'exit with error code if SODO score is below',
      default: 0,
      type: 'number',
    });
  },
  handler: argv => {
    // TODO calculate actual score
    const score = sodo.score();

    analytics.track({
      event: 'Score',
      properties: {
        command: argv._,
        score,
      },
    });

    console.log(score);

    const min = argv.min;
    if (score < min) {
      process.exit(1);
    }
  },
};
