const os = require('os');
const path = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const yaml = require('js-yaml');
const debug = require('debug')('config');
const uuidv1 = require('uuid/v1');

const userConfig = (function loadUserConfig() {
  const sodouserdir = path.join(os.homedir(), '.sodo');
  mkdirp.sync(sodouserdir);
  const userpath = path.join(sodouserdir, 'user.yml');

  if (!existsSync(userpath)) {
    const uuid = uuidv1();
    const config = { uuid };

    writeFileSync(userpath, yaml.safeDump(config), { encoding: 'utf-8' });
    return config;
  }

  try {
    return yaml.safeLoad(readFileSync(userpath, 'utf8'));
  } catch (e) {
    debug(e);
    throw e;
  }
})();

module.exports = userConfig;
