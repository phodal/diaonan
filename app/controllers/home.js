module.exports = function(app) {
  app.get('/designiot', function(req, res) {
    var _base;
    (_base = req.session).topics || (_base.topics = []);
    return res.render('designiot.hbs', {
      topics: req.session.topics
    });
  });

  return app.get('/', function(req, res) {
    var _base;
    (_base = req.session).topics || (_base.topics = []);
    return res.render('home.hbs', {
      topics: req.session.topics
    });
  });
};
