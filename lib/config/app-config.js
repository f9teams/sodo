var yaml = require('node-yaml');
var fs   = require('fs');
var path = require('path');
var config = require('./config');
var log = require('../util/logger.js');

var conf = {};

exports.load = function(file){

  if(typeof file === "undefined") file = config.defaults.appConfig;
  log.info("Loading application config file %s", file);
  try {

    conf = yaml.readSync(path.join(process.cwd(), file),
      {encoding: "utf8", schema: yaml.schema.defaultSafe});
    //conf = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
  } catch (e) {
    console.log(e);
  }

}

exports.save = function(conf, fileName) {
  if(typeof fileName === "undefined") fileName = config.defaults.appConfig;
  fileName = fileName + ".new";
  log.info("Saving application config file %s", fileName);
  try {
    yaml.writeSync(path.join(process.cwd(), fileName), conf, "utf8");
  } catch (e) {
    console.log(e);
  }
}


exports.get = function(){
  return conf;
}
