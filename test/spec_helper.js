var async, config, env;

env = require("../qest-app.js");

async = require("async");

config = {
	host: "127.0.0.1",
	port: 6379,
	db: 16
};

module.exports.globalSetup = function() {
	if (this.app != null) {
		return;
	}
	this.app = env.app;
	env.setup(config);
	return env.configure();
};

module.exports.globalTearDown = function() {
	return this.app.redis.client.end();
};

module.exports.setup = function(done) {
	env.setupAscoltatore(config);
	return async.parallel([
		(function(_this) {
			return function(cb) {
				return _this.app.ascoltatore.once("ready", cb);
			};
		})(this), (function(_this) {
			return function(cb) {
				return _this.app.redis.client.flushdb(cb);
			};
		})(this)
	], done);
};

module.exports.tearDown = function(done) {
	return this.app.ascoltatore.close(done);
};
