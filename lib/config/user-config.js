var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');
var config = require('./config');
var log = require('../util/logger.js');

var conf = {};

exports.load = function(file){

  if(typeof file === "undefined") file = config.defaults.userConfig;
  log.info("Loading user config file %s", file);
  try {
    conf = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.log(e);
  }

}

exports.get = function(){
  return conf;
}
