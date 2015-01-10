var HttpClient, request;

request = require('request');

HttpClient = (function () {
	function HttpClient(port, host) {
		this.port = port;
		this.host = host;
	}

	HttpClient.prototype.subscribe = function (topic) {
		throw new Error("Not implemented yet");
	};

	HttpClient.prototype.publish = function (topic, message, callback) {
		return request.put({
			uri: this.url(topic),
			form: {
				payload: message
			}
		}, callback);
	};

	HttpClient.prototype.getLastMessageFromTopic = function (topic, callback) {
		return request.get({
			uri: this.url(topic),
			headers: this.headers
		}, function (err, response, body) {
			return callback(body);
		});
	};

	HttpClient.prototype.headers = function () {
		return {};
	};

	HttpClient.prototype.disconnect = function () {
	};

	HttpClient.prototype.url = function (topic) {
		return "http://" + this.host + ":" + this.port + "/topics/" + topic;
	};

	return HttpClient;

})();

HttpClient.build = function (opts, callback) {
	return callback(new HttpClient(opts.port, "127.0.0.1"));
};

module.exports.HttpClient = HttpClient;
