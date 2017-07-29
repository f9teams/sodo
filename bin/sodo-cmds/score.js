const sodo = require('../../lib/sodo');

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

    console.log(score); // eslint-disable-line no-console

    const min = argv.min;
    if (score < min) {
      process.exit(1);
    }
  },
};
