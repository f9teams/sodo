#!/usr/bin/env node

/* eslint-disable no-console */

const y = require('yargs');
const log = require('../lib/log');
const registry = require('../lib/resource-registry');
const { noop, forEach, reduce, union } = require('lodash');
const initHandler = require('./handlers/init');
const listHandler = require('./handlers/list');
const verbHandler = require('./handlers/verb');
const analytics = require('../lib/analytics');

// 🚀 sodo⌝

y
  .env('SODO')
  // eslint-disable-next-line no-unused-vars
  .fail((message, err, yargs) => {
    if (err) {
      throw err;
    }

    console.error('see --help for usage');
    console.error(message);

    analytics.track(
      {
        event: 'Command Failed',
        properties: {
          message,
        },
      },
      () => {
        // TODO: this fucks up the bunyan file streams, they do not flush before the process dies
        process.exit(1);
      },
    );
  });

// We want to support `sodo <resource> <verb> [label]` and
// `sodo <verb> <resource> [label]. We'll watch what people run
// and use that to inform future design.

// build an array of pairs [[type, verb], [type, verb]]
const typeVerbPairs = reduce(
  registry.resources,
  (acc, types, type) => {
    forEach(types, typeSpec => {
      const verbs = typeSpec.class.verbs;
      forEach(verbs, verb => acc.push([type, verb, typeSpec.label]));
    });
    return acc;
  },
  [],
);

function handler(type, verb) {
  switch (verb) {
    case 'init':
      return initHandler(type);
    case 'list':
      return listHandler(type);
    default:
      return verbHandler(type, verb);
  }
}

// build a map of verb to types {verb: [type, type]}
const verbTypes = reduce(
  typeVerbPairs,
  (acc, [type, verb]) => {
    acc[verb] = union(acc[verb], [type]);
    return acc;
  },
  {},
);

Object.entries(verbTypes).forEach(([verb, types]) => {
  y.command([verb], false, vy => {
    types.forEach(type => {
      const cmdName = [`${type} [label]`];

      if (type === 'project') {
        cmdName.push('*');
      }

      vy.command(cmdName, 'TODO type description', noop, handler(type, verb));
    });
  });
});

// build a map of type to verbs {type: [verb, verb]}
const typeVerbs = reduce(
  typeVerbPairs,
  (acc, [type, verb]) => {
    acc[type] = union(acc[type], [verb]);
    return acc;
  },
  {},
);

Object.entries(typeVerbs).forEach(([type, verbs]) => {
  // will override any already registered <verb> <resource> command if type === verb
  // e.g. `sodo build` will refer only to the resource type `build` and not to he verb
  //      `build`. `sodo build list` will work, but `sodo build project` will not.
  y.command([type], '', ry => {
    verbs.forEach(verb => {
      const cmdName = [`${verb} [label]`];

      if (verb === 'show') {
        cmdName.push('*');
      }

      ry.command(cmdName, 'TODO verb description', noop, handler(type, verb));
    });
  });
});

y.version().help().commandDir('sodo-cmds').recommendCommands();

const argv = y.argv;
log.trace({ argv });
