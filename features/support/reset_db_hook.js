module.exports = function() {
  return this.Before(function(done) {
    var _base;
    if (typeof (_base = this.app.models.Data).reset === "function") {
      _base.reset();
    }
    return this.app.redis.client.flushdb((function(_this) {
      return function() {
        return done();
      };
    })(this));
  });
};
