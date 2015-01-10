var HttpJsonClient, request;

request = require('request');

HttpJsonClient = (function() {
  function HttpJsonClient(port, host) {
    this.port = port;
    this.host = host;
  }

  HttpJsonClient.prototype.subscribe = function(topic) {
    throw new Error("Not implemented yet");
  };

  HttpJsonClient.prototype.publish = function(topic, message, callback) {
    message = JSON.parse(message);
    return request.put({
      uri: this.url(topic),
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    }, callback);
  };

  HttpJsonClient.prototype.getLastMessageFromTopic = function(topic, callback) {
    return request.get({
      uri: this.url(topic),
      headers: {
        "Accept": "application/json"
      }
    }, function(err, response, body) {
      return callback(body);
    });
  };

  HttpJsonClient.prototype.disconnect = function() {};

  HttpJsonClient.prototype.url = function(topic) {
    return "http://" + this.host + ":" + this.port + "/topics/" + topic;
  };

  return HttpJsonClient;

})();

HttpJsonClient.build = function(opts, callback) {
  return callback(new HttpJsonClient(opts.port, "127.0.0.1"));
};

module.exports.HttpJsonClient = HttpJsonClient;
