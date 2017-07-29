/* eslint-disable no-unused-expressions, class-methods-use-this */

const expect = require('chai').expect;
const types = require('../lib/resource');
const { union } = require('lodash');

describe('resources', () => {
  it('unimplemented verbs return description', () => {
    const b = new types.Backlog();
    b.spec.config.description = 'hello world';
    const showDoc = b.show();

    expect(showDoc).to.equal('hello world');
  });

  it('unimplemented verbs return verb specific description when provided', () => {
    const b = new types.Backlog();
    b.spec.config.verbDescription = {
      show: 'hello world',
    };
    const showDoc = b.show();

    expect(showDoc).to.equal('hello world');
  });

  it('unimplemented verbs return description, undefined if no description is specified', () => {
    const b = new types.Backlog();
    const showDoc = b.show();

    expect(showDoc).to.be.undefined;
  });

  it('implemented verbs do not return description', () => {
    class MyBacklog extends types.Backlog {
      show() {
        return 123;
      }
    }

    const b = new MyBacklog();
    const showResult = b.show();

    expect(showResult).to.equal(123);
  });

  it('verbs are static', () => {
    class MyBacklog extends types.Backlog {
      static get verbs() {
        return union(super.verbs, ['jump', 'skip', 'hop', 'bounce']);
      }
    }

    const backlog = new MyBacklog();

    expect(MyBacklog.verbs).to.contain.members(['show', 'jump', 'bounce']);
    expect(backlog.constructor.verbs).to.contain.members([
      'show',
      'jump',
      'bounce',
    ]);
  });
});
