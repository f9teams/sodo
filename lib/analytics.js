// This file is compatible with legacy versions of node >= 4.0.0

// eslint-disable-next-line strict, lines-around-directive
'use strict';

const Analytics = require('analytics-node');
const user = require('./user');
const debug = require('debug')('analytics');

// TODO don't do this, I'm sure we don't want our write token here
const analytics = new Analytics('tD8OKaXbg1U3R6KubMbP0YAI6F2rczxL');

const originalTrack = analytics.track;
function userIdMiddleware(event, ...args) {
  const userId = user.uuid;
  // eslint-disable-next-line no-param-reassign
  event.userId = userId;
  debug('Track with UserId', event);
  args.unshift(event);
  return originalTrack.apply(analytics, args);
}

analytics.track = userIdMiddleware;

module.exports = analytics;
