const config = require('../../lib/config');

function listHandler(type) {
  return () => {
    const labels = config.resources[type].map(
      resourceSpec => resourceSpec.label,
    );
    labels.forEach(l => console.log(l)); // eslint-disable-line no-console
  };
}

module.exports = listHandler;
