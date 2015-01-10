var hbs;

hbs = require('hbs');

module.exports = function (app) {
	return hbs.registerHelper('notest', function (options) {
		var input;
		if (process.env.NODE_ENV !== "test") {
			input = options.fn(this);
			return input;
		} else {
			return "";
		}
	});
};
