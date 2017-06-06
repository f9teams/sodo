// Test suite for the backlog command

var assert = require('assert');

describe('sodo backlog', function() {
  describe('null', function() {
    it('should prompt the user to add if nothing is set');
    it('should return usage when nothing set');
  });
  describe('help', function() {
    it('should prompt the user to add if nothing is set');
    it('should return usage');
    it('should list the supported resources');
    it('should provide some whitty commentary');
    it('should list the available commands')
  });
  describe('add', function(){
    it('should provide usage if no further parameters are set');
    it('should fail gradefuly if an unsupported resource is specified');
    it('should support adding a text based resource');
  });

});
