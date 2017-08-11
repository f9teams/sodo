// This file is compatible with legacy versions of node >= 4.0.0

// eslint-disable-next-line strict, lines-around-directive
'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');
const debug = require('debug')('user');
const uuidv1 = require('uuid/v1');

let userConfig;

const sodoUserDir = path.join(os.homedir(), '.sodo');
mkdirp.sync(sodoUserDir);
const userpath = path.join(sodoUserDir, 'user.yml');

if (!fs.existsSync(userpath)) {
  const uuid = uuidv1();
  fs.writeFileSync(userpath, yaml.safeDump({ uuid }), {
    encoding: 'utf-8',
  });
}

try {
  userConfig = yaml.safeLoad(fs.readFileSync(userpath, 'utf8'));
} catch (e) {
  debug(e);
  throw e;
}

module.exports = userConfig;
