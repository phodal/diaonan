module.exports = function (app) {
	var Data;
	Data = app.models.Data;
	return app.io.sockets.on('connection', function (socket) {
		var subscriptions;
		subscriptions = {};
		socket.on('subscribe', function (topic) {
			var subscription;
			subscription = function (currentData) {
				return socket.emit("/topics/" + topic, currentData.value);
			};
			subscriptions[topic] = subscription;
			Data.subscribe(topic, subscription);
			return Data.find(topic, function (err, data) {
				if ((data != null ? data.value : void 0) != null) {
					return subscription(data);
				}
			});
		});
		return socket.on('disconnect', function () {
			var listener, topic, _results;
			_results = [];
			for (topic in subscriptions) {
				listener = subscriptions[topic];
				_results.push(Data.unsubscribe(topic, listener));
			}
			return _results;
		});
	});
};
