module.exports = function(app) {
  return app.get('/', function(req, res) {
    var _base;
    (_base = req.session).topics || (_base.topics = []);
    return res.render('home.hbs', {
      topics: req.session.topics
    });
  });
};
