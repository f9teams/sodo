var log = require('./util/logger.js');

module.exports = function(appConfig, userConfig){

  log.info("Initializing sodo");
  log.info("appConfig:", appConfig);
  log.info("userConfig:", userConfig);

  // Load in the config.
  var config = require('./config/config');

  // For each resource described in the config, load it in and intialize.
  var resources = [];

  config.resources.forEach(function(resource){
    console.log(resource);
    // Try and load the file in
    resources[resource] = require('./resources/'+resource);
  });

  // resources.


  // Look at the command and execute it.

  this.execute = function(){
    console.log(appConfig);
  };

  return this;
};
