var hbs;

hbs = require('hbs');

module.exports = function(app) {
    return hbs.registerHelper('markdown', function(options) {
        var input, result;
        input = options.fn(this);
        result = require("markdown").markdown.toHTML(input);
        return result;
    });
};
