// This file is compatible with legacy versions of node >= 4.0.0

// eslint-disable-next-line strict, lines-around-directive
'use strict';

const engines = require('./package.json').engines;
const semver = require('semver');
const analytics = require('./lib/analytics');
const user = require('./lib/user');
const debug = require('debug')('check-version');

const currentVersion = process.version;
const requiredVersion = engines.node;
const userId = user.uuid;

if (!semver.satisfies(currentVersion, requiredVersion)) {
  const message =
    'Current Node.js version (%s) does not satisfy required Node.js version (%s)';
  debug(message, currentVersion, requiredVersion);

  // eslint-disable-next-line no-console
  console.log(message, currentVersion, requiredVersion);

  analytics.track(
    {
      userId,
      event: 'Check Version Failed',
      properties: {
        currentVersion,
        requiredVersion,
      },
    },
    err => {
      debug('Analytics Flushed', err);
      process.exit(1);
    } // eslint-disable-line
  );
}
