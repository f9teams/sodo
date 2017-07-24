const sodo = require('../../lib/sodo');
const { isEmpty } = require('lodash');

function verbHandler(type, verb) {
  return (argv) => {
    const label = argv.label;
    const test = isEmpty(label) ? sodo.resources[type][0] : sodo.resources[type][label];
    return test[verb](argv);
  };
}

module.exports = verbHandler;
