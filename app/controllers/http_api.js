module.exports = function (app) {
	var Data, io;
	io = app.io;
	Data = app.models.Data;
	app.get(/^\/topics\/(.+)$/, function (req, res) {
		var index, topic, topics;
		topic = req.params[0];
		topics = req.session.topics || [];
		index = topics.indexOf(topic);
		if (index >= 0) {
			topics = [].concat(topics.splice(0, index), topics.splice(index + 1, req.session.topics.length));
		}
		topics.push(topic);
		if (topics.length > 5) {
			topics.pull();
		}
		req.session.topics = topics;
		return Data.find(topic, function (err, data) {
			var e, type;
			type = req.accepts(['txt', 'json', 'html']);
			if (type === "html") {
				return res.render('topic.hbs', {
					topic: topic
				});
			} else if (err != null) {
				return res.send(404);
			} else if (type === 'json') {
				res.contentType('json');
				try {
					return res.json(data.value);
				} catch (_error) {
					e = _error;
					return res.json("" + data.value);
				}
			} else if (type === 'txt') {
				return res.send(data.value);
			} else {
				return res.send(406);
			}
		});
	});
	return app.put(/^\/topics\/(.+)$/, function (req, res) {
		var payload, topic;
		topic = req.params[0];
		if (req.is("json")) {
			payload = req.body;
		} else {
			payload = req.body.payload;
		}
		Data.findOrCreate(topic, payload);
		return res.send(204);
	});
};
