var HttpClient, HttpJsonClient, HttpTxtClient, MqttClient, app, browser, env, opts, protocols, zombie;

env = require("../../qest-app.js");

zombie = require('zombie');

opts = {
  port: 9777,
  mqtt: 9778,
  coap: 5683,
  redisHost: "127.0.0.1",
  redisPort: 6379,
  redisDB: 16
};

app = env.start(opts);

browser = new zombie.Browser({
  site: "http://localhost:" + opts.port,
  headers: {
    "Accept": "text/html"
  }
});

MqttClient = require("./clients/mqtt").MqttClient;

HttpClient = require("./clients/http").HttpClient;

HttpJsonClient = require("./clients/http_json").HttpJsonClient;

HttpTxtClient = require("./clients/http_txt").HttpTxtClient;

protocols = {
  HTTP: HttpClient,
  HTTP_JSON: HttpJsonClient,
  HTTP_TXT: HttpTxtClient,
  MQTT: MqttClient
};

exports.World = function(callback) {
  this.browser = browser;
  this.opts = opts;
  this.app = app;
  this.clients = {};
  this.getClient = (function(_this) {
    return function(protocol, name, callback) {
      if (_this.clients[name] != null) {
        return callback(_this.clients[name]);
      } else {
        return protocols[protocol].build(_this.opts, function(client) {
          _this.clients[name] = client;
          return callback(client);
        });
      }
    };
  })(this);
  return callback();
};
