// This file is compatible with legacy versions of node >= 4.0.0.

// eslint-disable-next-line strict, lines-around-directive
'use strict';

const analytics = require('./lib/analytics');
const user = require('./lib/user');

const userId = user.uuid;

analytics.track({
  userId,
  event: 'Install',
  properties: {},
});
