var expect;

expect = require('chai').expect;

module.exports = function() {
  this.Given(/^I open the topic "([^"]*)"$/, function(topic, callback) {
    return this.browser.visit("/", (function(_this) {
      return function() {
        return _this.browser.fill("topic", topic, function() {
          return _this.browser.pressButton("GO!", callback);
        });
      };
    })(this));
  });
  return this.When(/^I change the payload to "([^"]*)"$/, function(payload, callback) {
    return this.browser.pressButton("Edit", (function(_this) {
      return function() {
        return _this.browser.fill("payload", payload, function() {
          return _this.browser.pressButton("Update", callback);
        });
      };
    })(this));
  });
};
