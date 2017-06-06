var log = require('./util/logger.js');

module.exports = function(appConfig, userConfig){

  log.info("Initializing sodo");
  log.info("appConfig:", appConfig);
  log.info("userConfig:", userConfig);

  //Migrate this to a resource so that sodo can configure itself.

  let sodoConfig = appConfig.resources.config;

  if(!sodoConfig) {
    console.log("Sodo is not configured for the current application.");
  }

  var config;
  if(sodoConfig.type === "local") {
    // Load in the config.
    var config = require('./config/config');
  } else {
    console.log("Unknown configuration type.");
  }

  // For each resource described in the config, load it in and intialize.
  var resources = {};
  var types = {};

  var operations = {};

  config.resources.forEach(function(resource){
    // Try and load the file in
    var res = require('./resources/'+resource);

    res.types.forEach(function(type){

      // Load the type object.
      // Get the list of operations
      // if(typeof resource["remove"] === "function") call it.

      // type.create(type);
      if(!(type in resources)){
        resources[type] = {};
      }

      res.ops.forEach(function(op){
        if(op in res){
          if(!(op in resources[type])){
            resources[type][op] = {};
          }
          resources[type][op][resource] = res[op];
        }
        else{
          log.error("Failed to load resource %s", resource);
          log.error("No method named %s", op);
        }
        log.error(type, op, resource);
      });
    });

    log.info(resources);

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
