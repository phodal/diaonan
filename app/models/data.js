var EventEmitter, KEYS_SET_NAME, events, globalEventEmitter;

EventEmitter = require('events').EventEmitter;

globalEventEmitter = new EventEmitter();

globalEventEmitter.setMaxListeners(0);

events = {};

KEYS_SET_NAME = 'topics';

module.exports = function (app) {
	var Data, buildKey;
	buildKey = function (key) {
		return "topic:" + key;
	};
	Data = (function () {
		function Data(key, value) {
			this.key = key;
			this.value = value;
			this.value || (this.value = null);
		}

		Object.defineProperty(Data.prototype, 'key', {
			enumerable: true,
			configurable: false,
			get: function () {
				return this._key;
			},
			set: function (key) {
				this.redisKey = buildKey(key);
				return this._key = key;
			}
		});

		Object.defineProperty(Data.prototype, 'jsonValue', {
			configurable: false,
			enumerable: true,
			get: function () {
				return JSON.stringify(this.value);
			},
			set: function (val) {
				return this.value = JSON.parse(val);
			}
		});

		Data.prototype.save = function (callback) {
			app.redis.client.set(this.redisKey, this.jsonValue, (function (_this) {
				return function (err) {
					return app.ascoltatore.publish(_this.key, _this.value, function () {
						if (callback != null) {
							return callback(err, _this);
						}
					});
				};
			})(this));
			return app.redis.client.sadd(KEYS_SET_NAME, this.key);
		};

		return Data;

	})();
	Data.find = function (pattern, callback) {
		var foundRecord;
		foundRecord = function (key) {
			return app.redis.client.get(buildKey(key), function (err, value) {
				if (err) {
					if (callback != null) {
						callback(err);
					}
					return;
				}
				if (value == null) {
					if (callback != null) {
						callback("Record not found");
					}
					return;
				}
				if (callback != null) {
					return callback(null, Data.fromRedis(key, value));
				}
			});
		};
		if (pattern.constructor !== RegExp) {
			foundRecord(pattern);
		} else {
			app.redis.client.smembers(KEYS_SET_NAME, function (err, topics) {
				var topic, _i, _len, _results;
				_results = [];
				for (_i = 0, _len = topics.length; _i < _len; _i++) {
					topic = topics[_i];
					if (pattern.test(topic)) {
						_results.push(foundRecord(topic));
					} else {
						_results.push(void 0);
					}
				}
				return _results;
			});
		}
		return Data;
	};
	Data.findOrCreate = function () {
		var arg, args, callback, key, value;
		args = Array.prototype.slice.call(arguments);
		key = args.shift();
		arg = args.shift();
		if (typeof arg === 'function') {
			callback = arg;
		} else {
			value = arg;
			callback = args.shift();
		}
		app.redis.client.get(buildKey(key), function (err, oldValue) {
			var data;
			data = Data.fromRedis(key, oldValue);
			if (value != null) {
				data.value = value;
			}
			return data.save(callback);
		});
		return Data;
	};
	Data.fromRedis = function (topic, value) {
		var data;
		data = new Data(topic);
		data.jsonValue = value;
		return data;
	};
	Data.subscribe = function (topic, callback) {
		callback._subscriber = function (actualTopic, value) {
			return callback(new Data(actualTopic, value));
		};
		app.ascoltatore.subscribe(topic, callback._subscriber);
		return this;
	};
	Data.unsubscribe = function (topic, callback) {
		app.ascoltatore.unsubscribe(topic, callback._subscriber);
		return this;
	};
	return Data;
};
