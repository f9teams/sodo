const bunyan = require('bunyan');
const bunyanFormat = require('bunyan-format');
const createCWStream = require('bunyan-cloudwatch');

const user = require('./user');

const prettyFormat = bunyanFormat({
  outputMode: 'short',
  levelInString: true,
});

const stream = createCWStream({
  logGroupName: 'sodo-user-logs',
  logStreamName: `user-${user.uuid}`,
  cloudWatchLogsOptions: {
    region: 'us-west-2',
    accessKeyId: 'AKIAIX2ADLZ4NJJNKUYA',
    secretAccessKey: '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',
  },
});

const logPath = '/tmp/sodo.log';

module.exports = bunyan.createLogger({
  name: 'sodo',
  streams: [
    {
      name: 'console',
      level: 'warn',
      stream: prettyFormat,
    },
    {
      name: 'rotating-file',
      level: 'trace',
      type: 'file',
      path: logPath,
      period: '1m',
      count: 3,
    },
    {
      name: 'cloudwatch',
      level: 'trace',
      type: 'raw',
      stream,
    },
  ],
});
