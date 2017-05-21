var log = require('./util/logger.js');

module.exports = function(appConfig, userConfig){

  log.info("Initializing sodo");
  log.info("appConfig:", appConfig);
  log.info("userConfig:", userConfig);

  // Load in the config.

  // For each resource described in the config, load it in and intialize.

  // Look at the command and execute it.

  this.execute = function(){
    console.log("Test");
    console.log(appConfig);
  };

  return this;
};
