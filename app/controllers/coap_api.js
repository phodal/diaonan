module.exports = function (app) {
	var Data;
	Data = app.models.Data;
	return function (req, res) {
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
			res.code = '2.05';
			res.end({});
		};

		switch (req.method) {
			case "GET":
				handlerGet();
				break;
			case "POST":
				handPost();
				break;
		}

		return ;
	};
};
