var chalk = require("chalk");

module.exports = jira;

var jira = {
  types: ["backlog", "tickets"],
  ops: ["add", "remove", "onboard", "offboard", "summary", "list", "usage"]
};

jira.onboard = function(req, res){};
jira.offboard = function(req, res){};

jira.usage = function(req, res){
  var ret =  chalk.green("JIRA");
      ret += "This is a badass module that needs a lot of config";
      ret += "When you figure it out let me know because..."
};

jira.add = function(){};

jira.remove = function(){};
