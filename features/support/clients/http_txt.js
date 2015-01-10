var HttpClient, HttpTxtClient,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

HttpClient = require('./http').HttpClient;

HttpTxtClient = (function(_super) {
  __extends(HttpTxtClient, _super);

  function HttpTxtClient() {
    return HttpTxtClient.__super__.constructor.apply(this, arguments);
  }

  HttpTxtClient.prototype.headers = function() {
    return {
      "Accept": "text/plain"
    };
  };

  return HttpTxtClient;

})(HttpClient);

HttpTxtClient.build = function(opts, callback) {
  return callback(new HttpTxtClient(opts.port, "127.0.0.1"));
};

module.exports.HttpTxtClient = HttpTxtClient;
