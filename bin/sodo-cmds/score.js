module.exports = {
  command: 'score',
  builder: (yargs) => {
    yargs.option('m', {
      alias: ['min'],
      describe: 'exit with error code if SODO score is below',
      default: 0,
      type: 'number',
    });
  },
  handler: (argv) => {
    // TODO calculate actual score
    const score = 50;

    console.log(score);

    const min = argv.min;
    if (score < min) {
      process.exit(1);
    }
  },
};
