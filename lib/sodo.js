var log = require('./util/logger.js');
var configFunc = require("./config/app-config.js");

var Sodo = function(appConfig, userConfig){
  let _self = this;
  log.info("Initializing sodo");
  log.info("appConfig:", appConfig);
  log.info("userConfig:", userConfig);

  _self.appConfig = appConfig;
  _self.userConfig = userConfig;

  //Migrate this to a resource so that sodo can configure itself.

  let sodoConfig = _self.appConfig.resources.config;

  if(!sodoConfig) {
    console.log("Sodo is not configured for the current application.");
  }

  if(sodoConfig.type === "local") {
    // Load in the config.
    _self.config = require('./config/config');
  } else {
    console.log("Unknown configuration type.");
  }

  // For each resource described in the config, load it in and intialize.
  _self.resources = {};
  _self.types = {};

  var operations = {};

  if(_self.config.resources) {
  _self.config.resources.forEach(function(resource){
    console.log(resource);
    // Try and load the file in
    var res = require('./resources/'+resource);

    res.types.forEach(function(type){

      // Load the type object.
      // Get the list of operations
      // if(typeof resource["remove"] === "function") call it.

      // type.create(type);
      if(!(type in _self.resources)){
        _self.resources[type] = {};
      }

      res.ops.forEach(function(op){
        if(op in res){
          if(!(op in _self.resources[type])){
            _self.resources[type][op] = {};
          }
          _self.resources[type][op][resource] = res[op];
        }
        else{
          log.error("Failed to load resource %s", resource);
          log.error("No method named %s", op);
        }
        log.error(type, op, resource);
      });
    });

    log.info(_self.resources);

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
  }
  // resources.


  // Look at the command and execute it.
  this.saveConfig();
};

Sodo.prototype.execute = function(){
  // Should have a type, command, & args.
  // If type in types
    // If command in
};

Sodo.prototype.saveConfig = function() {
  configFunc.save(this.appConfig);
}

module.exports = Sodo;
