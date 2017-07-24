/* eslint-disable no-unused-expressions, class-methods-use-this */

const expect = require('chai').expect;
const sodo = require('../lib/sodo');
const { Backlog } = require('../lib/resource');

sodo.init({
  resources: {
    get backlog() {
      return new Proxy([], {
        get: () => ({
          label: 'MockBacklog',
          id: 'mock',
        }),
        has: () => true,
      });
    },
  },
}, {
  resources: {
    backlog: {
      mock: { label: 'Mock Backlog', class: Backlog },
    },
  },
});

describe('sodo', () => {
  it('has resources', () => {
    expect(sodo.resources, 'sodo.resources not an object').to.be.an('object');
  });

  it('all resources are arrays', () => {
    Object.keys(sodo.resources).forEach((k) => {
      const resource = sodo.resources[k];
      expect(resource, `${k} in sodo.resources not an array`).to.be.an('array');
    });
  });
});
