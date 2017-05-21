var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var config = require('./config');
var log = require('../util/logger.js');

var conf = {};

exports.load = function(file){

  if(typeof file === "undefined") file = config.defaults.appConfig;
  log.info("Loading application config file %s", file);
  try {
    conf = yaml.safeLoad(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
  } catch (e) {
    console.log(e);
  }

}

exports.get = function(){
  return conf;
}
