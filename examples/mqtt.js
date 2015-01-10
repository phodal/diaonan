var mqtt = require('mqtt')
  , client = mqtt.connect('mqtt://localhost?clientId=123abc');

client.subscribe('messages');
client.publish('messages', 'hello me!');
client.on('message', function(topic, message) {
    console.log(message);
});
