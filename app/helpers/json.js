var hbs;

hbs = require('hbs');

module.exports = function (app) {
	return hbs.registerHelper('json', function (context) {
		return new hbs.SafeString(JSON.stringify(context));
	});
};
