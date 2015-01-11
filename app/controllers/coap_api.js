module.exports = function (app) {
	var Data;
	var _      = require("underscore");

	Data = app.models.Data;
	return function (req, res) {
		console.log(req.method, req.options);
		var handlerGet = function () {
			if (/^\/topics\/(.+)$/.exec(req.url) === null){
				res.code = '4.04';
				res.end({error: 4.04, message: "not found"});
				return;
			}

			var topic = /^\/topics\/(.+)$/.exec(req.url)[1];
			return Data.find(topic, function (err, data) {
				var e;
				console.log(data.value);
				if (err !== null) {
					res.code = '4.04';
					res.end({error: 4.04});
				} else {
					try {
						res.code = '2.05';
						res.end(data.value);
					} catch (_error) {
						e = _error;
						console.log(e);
						res.code = '2.06';
						res.end({error: 4.04, message: e});
					}
				}
			});
		};

		var handPost = function () {
			function parse_buffer(req) {
				'use strict';
				var results, block =[];
				var payload = req.payload.toString();
				try {
					payload = JSON.parse(payload);
				} catch (e) {
					console.log(payload);
				}
				results = {payload: payload};
				_.each(req.options, function (option) {
					if (/^Block([a-z0-9]{1,})$/.test(option.name)) {
						block.push(_.values(option).toString().split(',')[1]);
					}
				});

				results = _.extend(results, {block: block});
				return results;
			}

			if (/^\/topics\/(.+)$/.exec(req.url) === null){
				res.code = '4.04';
				res.end({error: 4.04, message: "no permisssion"});
				return;
			}
			var topic = /^\/topics\/(.+)$/.exec(req.url)[1];
			Data.findOrCreate(topic, parse_buffer(req));
			res.code = '2.06';
			res.end({message: parse_buffer(req)});
		};

		var other = function () {
			res.code = '4.04';
			res.end({error: "not support"})
		};
		switch (req.method) {
			case "GET":
				handlerGet();
				break;
			case "PUT":
			case "POST":
				handPost();
				break;
			default:
				other();
				break;
		}

		return ;
	};
};
