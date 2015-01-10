var expect;

expect = require('chai').expect;

module.exports = function() {
  this.When(/^I visit "([^"]*)"$/, function(url, callback) {
    return this.browser.visit(url, callback);
  });
  this.Then(/^I should see "([^"]*)"$/, function(text, callback) {
    expect(this.browser.text("body")).to.include(text);
    return callback();
  });
  this.Then(/^I should see "([^"]*)" in the textarea$/, function(text, callback) {
    var doneWaiting;
    doneWaiting = (function(_this) {
      return function() {
        expect(_this.browser.field("textarea").value).to.include(text);
        return callback();
      };
    })(this);
    if (this.browser.field("textarea").value.indexOf(text) !== -1) {
      return callback();
    } else {
      return setTimeout(doneWaiting, 50);
    }
  });
  return this.Then(/^I should see the title "([^"]*)"$/, function(text, callback) {
    expect(this.browser.text("title")).to.equal(text);
    return callback();
  });
};
