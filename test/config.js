/* eslint-disable no-unused-expressions, class-methods-use-this */

const expect = require('chai').expect;
const config = require('../lib/config');

config.load(); // The singleton approach is bad for testing.

describe('config', () => {
  it('loads', () => {
    expect(config).to.be.an('object');
  });

  it('saves', () => {
    config.save();
  });
});
