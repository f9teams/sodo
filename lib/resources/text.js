var chalk = require("chalk");

var text = {
  types: ["backlog", "tickets", "ci", "cd"],
  ops: ["add", "remove", "onboard", "offboard", "summary", "list", "usage"]
};

text.onboard = function(req, res){};
text.offboard = function(req, res){};

text.usage = function(req, res){
  var ret =  chalk.green("JIRA");
      ret += "This is a badass module that needs a lot of config";
      ret += "When you figure it out let me know because..."
};

text.add = function(){};

text.remove = function(){};

module.exports = text;
