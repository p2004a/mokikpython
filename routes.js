var params = require('express-params');

exports.extend = function (app) {
  params.extend(app);

  app.get('/', function (req, res) {
    app.render('index', function (err, html) {
      res.send(html);
    });
  });

  app.param('partial', /^([a-z]+)\.html$/);
  app.get('/partials/:partial', function (req, res) {
    app.render('partials/' + req.params.partial[1], function (err, html) {
      res.send(html);
    });
  });

  app.get('*', function (req, res) {
    app.render('404', function (err, html) {
      res.send(404, html);
    });
  });
}
