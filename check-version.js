const engines = require('./package.json').engines;
const semver = require('semver');

const version = engines.node;
if (!semver.satisfies(process.version, version)) {
  // eslint-disable-next-line no-console
  console.log(
    `Required node version ${version} is not met by current version ${process.version}.`,
  );
  process.exit(1);
}
