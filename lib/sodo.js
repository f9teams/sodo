var log = require('./util/logger.js');

module.exports = function(appConfig, userConfig){

  log.info("Initializing sodo");
  log.info("appConfig:", appConfig);
  log.info("userConfig:", userConfig);

  // Load in the config.
  var config = require('./config/config');

  // For each resource described in the config, load it in and intialize.
  var resources = {};
  var types = {};

  config.resources.forEach(function(resource){
    console.log(resource);
    // Try and load the file in
    var res = require('./resources/'+resource);
    resources[resource] = res;

    // Now for each type this claims to be, register it as a valid handler.
    // res.types.forEach(...);
    // then figure out the commands that are valid

    /* output should be:

      tickets:
        add:
          jira
          trello
          manual
          file
          remedy
        remove:
          jira
          trello
          manual
          file
          remedy
        onboard:
          jira
          trello
          manual
          file

          ...


    */


  });

  // resources.


  // Look at the command and execute it.

  this.execute = function(){
    // Should have a type, command, & args.
    // If type in types
      // If command in


  };

  return this;
};
