var MqttClient, counter, mqtt;

mqtt = require('mqtt');

MqttClient = (function() {
  function MqttClient(client) {
    this.client = client;
    this.last_packets = {};
    this.client.on('publish', (function(_this) {
      return function(packet) {
        return _this.last_packets[packet.topic] = packet.payload;
      };
    })(this));
  }

  MqttClient.prototype.subscribe = function(topic) {
    return this.client.subscribe({
      topic: topic
    });
  };

  MqttClient.prototype.publish = function(topic, message, callback) {
    this.client.publish({
      topic: topic,
      payload: message
    });
    return callback();
  };

  MqttClient.prototype.disconnect = function() {
    return this.client.disconnect();
  };

  MqttClient.prototype.getLastMessageFromTopic = function(topic, callback) {
    var last_packet, listenToPublish;
    last_packet = this.last_packets[topic];
    if (last_packet != null) {
      callback(last_packet);
      return;
    }
    listenToPublish = (function(_this) {
      return function(packet) {
        if (packet.topic === topic) {
          callback(packet.payload);
          return _this.client.removeListener(topic, listenToPublish);
        }
      };
    })(this);
    return this.client.on('publish', listenToPublish);
  };

  return MqttClient;

})();

counter = 0;

MqttClient.build = function(opts, callback) {
  return mqtt.createClient(opts.mqtt, "127.0.0.1", (function(_this) {
    return function(err, client) {
      if (err != null) {
        throw new Error(err);
      }
      client.connect({
        client: "cucumber " + (counter++) + "!",
        keepalive: 3000
      });
      return client.on('connack', function(packet) {
        if (packet.returnCode === 0) {
          return callback(new MqttClient(client));
        } else {
          console.log('connack error %d', packet.returnCode);
          throw new Error("connack error " + packet.returnCode);
        }
      });
    };
  })(this));
};

module.exports.MqttClient = MqttClient;
