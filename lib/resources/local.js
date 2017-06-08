var chalk = require("chalk");

module.exports = local;

var local = {
  types: ["local"],
  ops: ["add", "remove", "list", "usage"]
};

local.usage = function(req, res){
  var ret =  chalk.green("LOCAL Sodo\n");
      ret += "Headless Sodo works entirely by manipulating a .yaml file associated with your project."
      ret += "(that you should version control!)
};

local.add = function(){};

local.remove = function(){};
