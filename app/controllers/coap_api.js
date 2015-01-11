module.exports = function (app) {
	var Data;
	var _      = require("underscore");

	Data = app.models.Data;
	return function (req, res) {
		console.log(req.method, req.options);
		var handlerGet = function () {
			console.log(/^\/topics\/(.+)$/.exec(req.url));
			if (/^\/topics\/(.+)$/.exec(req.url) === null){
				res.code = '4.04';
				res.end({error: 4.04});
				return;
			}
			var topic = /^\/topics\/(.+)$/.exec(req.url)[1];
			return Data.find(topic, function (err, data) {
				var e, type;
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
				var block_save = [], result =[];
				block_save.push({payload:req.payload.toString()});
				_.each(req.options, function (option) {
					if (/^Block([a-z0-9]{1,})$/.test(option.name)) {
						result.push(_.values(option).toString().split(',')[1]);
					}
				});
				block_save.push({"block": result});
				return block_save;
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

		switch (req.method) {
			case "GET":
				handlerGet();
				break;
			case "PUT":
			case "POST":
				handPost();
				break;
		}

		return ;
	};
};
