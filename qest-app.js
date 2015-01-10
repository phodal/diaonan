var EventEmitter, RedisStore, app, argv, ascoltatori, configure, express, fs, hbs, http, load, mqtt, optimist, optionParser, path, redis, setup, setupAscoltatore, start;

optimist = require('optimist');

express = require('express');

path = require('path');

fs = require('fs');

hbs = require('hbs');

redis = require('redis');

mqtt = require("mqtt");

EventEmitter = require('events').EventEmitter;

RedisStore = require('connect-redis')(express);

ascoltatori = require('ascoltatori');

module.exports.app = app = express();

http = require('http').createServer(app);

app.redis = {};

module.exports.configure = configure = function () {
	var io;
	app.configure('development', function () {
		return app.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
	});
	app.configure('production', function () {
		return app.use(express.errorHandler());
	});
	app.configure(function () {
		app.set('views', __dirname + '/app/views');
		app.set('view engine', 'hbs');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({
			secret: "wyRLuS5A79wLn3ItlGVF61Gt"
		}, {
			store: new RedisStore({
				client: app.redis.client
			}),
			maxAge: 1000 * 60 * 60 * 24 * 14
		}));
		app.use(app.router);
		return app.use(express["static"](__dirname + '/public'));
	});
	io = app.io = require('socket.io').listen(http);
	io.configure('production', function () {
		io.enable('browser client minification');
		io.enable('browser client etag');
		io.enable('browser client gzip');
		return io.set('log level', 0);
	});
	io.configure('test', function () {
		return io.set('log level', 0);
	});
	load("models");
	load("controllers");
	return load("helpers");
};

load = function (key) {
	var component, loadPath, loadedModule, _i, _len, _ref, _results;
	app[key] = {};
	loadPath = __dirname + ("/app/" + key + "/");
	_ref = fs.readdirSync(loadPath);
	_results = [];
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		component = _ref[_i];
		if (component.match(/(js|coffee)$/)) {
			component = path.basename(component, path.extname(component));
			loadedModule = require(loadPath + component)(app);
			if (((loadedModule != null ? loadedModule.name : void 0) != null) && loadedModule.name !== "") {
				component = loadedModule.name;
			}
			_results.push(app[key][component] = loadedModule);
		} else {
			_results.push(void 0);
		}
	}
	return _results;
};

optionParser = optimist["default"]('port', 3000)["default"]('mqtt', 1883)["default"]('redis-port', 6379)["default"]('redis-host', '127.0.0.1')["default"]('redis-db', 0).usage("Usage: $0 [-p WEB-PORT] [-m MQTT-PORT] [-rp REDIS-PORT] [-rh REDIS-HOST]").alias('port', 'p').alias('mqtt', 'm').alias('redis-port', 'rp').alias('redis-host', 'rh').alias('redis-db', 'rd').describe('port', 'The port the web server will listen to').describe('mqtt', 'The port the mqtt server will listen to').describe('redis-port', 'The port of the redis server').describe('redis-host', 'The host of the redis server').boolean("help").describe("help", "This help");

argv = optionParser.argv;

module.exports.setupAscoltatore = setupAscoltatore = function (opts) {
	if (opts == null) {
		opts = {};
	}
	return app.ascoltatore = new ascoltatori.RedisAscoltatore({
		redis: redis,
		port: opts.port,
		host: opts.host,
		db: opts.db
	});
};

module.exports.setup = setup = function (opts) {
	var args;
	if (opts == null) {
		opts = {};
	}
	args = [opts.port, opts.host];
	app.redis.client = redis.createClient.apply(redis, args);
	app.redis.client.select(opts.db || 0);
	return setupAscoltatore(opts);
};

start = module.exports.start = function (opts, cb) {
	var countDone, done;
	if (opts == null) {
		opts = {};
	}
	if (cb == null) {
		cb = function () {
		};
	}
	opts.port || (opts.port = argv.port);
	opts.mqtt || (opts.mqtt = argv.mqtt);
	opts.redisPort || (opts.redisPort = argv['redis-port']);
	opts.redisHost || (opts.redisHost = argv['redis-host']);
	opts.redisDB || (opts.redisDB = argv['redis-db']);
	if (argv.help) {
		optionParser.showHelp();
		return 1;
	}
	setup({
		port: opts.redisPort,
		host: opts.redisHost,
		db: opts.redisDB
	});
	configure();
	countDone = 0;
	done = function () {
		if (countDone++ === 2) {
			return cb();
		}
	};
	http.listen(opts.port, function () {
		console.log("mqtt-rest web server listening on port %d in %s mode", opts.port, app.settings.env);
		return done();
	});
	mqtt.createServer(app.controllers.mqtt_api).listen(opts.mqtt, function () {
		console.log("mqtt-rest mqtt server listening on port %d in %s mode", opts.mqtt, app.settings.env);
		return done();
	});
	return app;
};

if (require.main.filename === __filename) {
	start();
}
