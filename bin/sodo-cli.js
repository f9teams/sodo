#!/usr/bin/env node
// Some shared dependencies
var fs   = require('fs');
var path = require('path');
var stream = require("stream").Stream

// Load the sodo.js file
var sodo = require('../lib/sodo.js');

// Grab a logger for logs.
var log = require("../lib/util/logger.js");

// Pull in the config file which will have a list of commands/resources
var config = require("../lib/config/config");

// Parse the command line options
var nopt = require("nopt")
  , parsed = nopt(config.cli.types, config.cli.shorthands);

// Execute the appropriate command..
var type = parsed.argv.remain[0];
var command = parsed.argv.remain[1];
var args = parsed.argv.remain.slice(2);

// Default command is list
if(typeof type == "undefined") type = "usage";
if(typeof command == "undefined") command = "list";

log.info({
  type: type,
  command: command,
  args: args
});

// Pull in the sodo.yaml from the directory we are being exectued in
var appConfig = require('../lib/config/app-config.js');
appConfig.load();

// Pull in the .sodo.user.defaults.yaml from the user's home directory
var userConfig = require('../lib/config/user-config.js');
userConfig.load();

// At this point we should be ready to do some work. All of our things are in order.
var client = sodo(appConfig.get(), userConfig.get());
client.execute(type, command, args);
