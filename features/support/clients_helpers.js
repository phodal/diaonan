module.exports = function() {
  return this.After(function(done) {
    var client, name, _ref;
    _ref = this.clients;
    for (name in _ref) {
      client = _ref[name];
      client.disconnect();
    }
    return done();
  });
};
