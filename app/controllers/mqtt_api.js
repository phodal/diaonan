module.exports = function (app) {
	var Data;
	Data = app.models.Data;
	return function (client) {
		var listeners, unsubscribeAll;
		listeners = {};
		unsubscribeAll = function () {
			var listener, topic, _results;
			_results = [];
			for (topic in listeners) {
				listener = listeners[topic];
				_results.push(Data.unsubscribe(topic, listener));
			}
			return _results;
		};
		client.on('connect', function (packet) {
			client.id = packet.client;
			return client.connack({
				returnCode: 0
			});
		});
		client.on('subscribe', function (packet) {
			var granted, subscription, subscriptions, _i, _j, _len, _len1, _ref, _results;
			granted = [];
			subscriptions = [];
			_ref = packet.subscriptions;
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				subscription = _ref[_i];
				subscriptions.push(subscription.topic.replace("#", "*"));
				granted.push(0);
			}
			client.suback({
				messageId: packet.messageId,
				granted: granted
			});
			_results = [];
			for (_j = 0, _len1 = subscriptions.length; _j < _len1; _j++) {
				subscription = subscriptions[_j];
				_results.push((function () {
					var listener;
					listener = function (data) {
						var error, value;
						try {
							if (typeof data.value === "string") {
								value = data.value;
							} else {
								value = data.jsonValue;
							}
							return client.publish({
								topic: data.key,
								payload: value
							});
						} catch (_error) {
							error = _error;
							console.log(error);
							return client.close();
						}
					};
					listeners[subscription] = listener;
					Data.subscribe(subscription, listener);
					return Data.find(new RegExp(subscription), function (err, data) {
						if (err != null) {
							throw err;
						}
						return listener(data);
					});
				})());
			}
			return _results;
		});
		client.on('publish', function (packet) {
			var error, payload;
			payload = packet.payload;
			try {
				payload = JSON.parse(payload);
			} catch (_error) {
				error = _error;
			}
			return Data.findOrCreate(packet.topic, payload);
		});
		client.on('pingreq', function (packet) {
			return client.pingresp();
		});
		client.on('disconnect', function () {
			return client.stream.end();
		});
		client.on('error', function (error) {
			console.log(error);
			return client.stream.end();
		});
		client.on('close', function (err) {
			return unsubscribeAll();
		});
		return client.on('unsubscribe', function (packet) {
			return client.unsuback({
				messageId: packet.messageId
			});
		});
	};
};
