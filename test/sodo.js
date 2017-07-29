/* eslint-disable no-unused-expressions, class-methods-use-this */

const expect = require('chai').expect;
const sodo = require('../lib/sodo');
const config = require('../lib/config');

config.mock().with('forum', {
  id: 'slackChannel',
  label: 'mock',
  config: {
    description: 'Mock',
    domain: 'https://mock.slack.com',
    channel: 'mock',
  },
});

describe('sodo', () => {
  it('has resources', () => {
    expect(sodo.resources, 'sodo.resources not an object').to.be.an('object');
  });

  it('has a forum', () => {
    expect(sodo.resources.forum.length, 'there should be one forum').to.equal(
      1,
    );
  });

  it('has no backlog', () => {
    expect(
      sodo.resources.backlog.length,
      'there should not be a backlog',
    ).to.equal(0);
  });

  it('can be accessed by index', () => {
    const resource = sodo.resources.forum[0];
    expect(
      resource.spec.id,
      'the slack channel is not accessible by index',
    ).to.equal('slackChannel');
  });

  it('can be accessed by label', () => {
    const resource = sodo.resources.forum.mock;
    expect(
      resource.spec.id,
      'the slack channel is not accessible by label',
    ).to.equal('slackChannel');
  });

  it('has a sodo score', () => {
    expect(sodo.score(), 'the score was not computed correctly').to.equal(16);
  });
});
