module.exports = function (app) {
	var Data;
	Data = app.models.Data;
	return function (req, res) {
		console.log(req,res);
		var handlerGet = function () {
			res.code = '2.05';
			res.end({});
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

		return req.on('request', function (packet) {
			return req.unsuback({
				messageId: packet.messageId
			});
		});
	};
};
