
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('image types', ['image/png', 'image/gif', 'image/pjpeg', 'image/jpeg']);
  app.set('image size', 200 * 1024);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.post('/upload_photo', function(req, res) {
  var new_name = (function() {
    var formal_name = req.files.photo.name;
    var e_name = formal_name.substring(formal_name.lastIndexOf('.'), formal_name.length);
    var d = new Data();
    var p_name = crtyto.createHash('sha1').update(formal_name + d.getTime());

    return p_name + e_name;
  })();

  var tmp_path = req.files.photo.path;
  var target_path = './public/images/' + new_name;
  var link = '/images/' + new_name;

  if (req.files.photo.size <= app.get('image size') &&
    app.get('image types').indexOf(req.files.photo.size) != -1 ) {
    fs.rename(tmp_path, target_path, function(err) {
      if (err) throw err;

      fs.unlink(tmp_path, function() {
        if (err) throw err;
        res.send(link);
      });
    });
  } else {
    fs.unlink(tmp_path, function(err) {
      if (err) throw err;
      res.send('invalid');
    })
  }

});

app.post('/contacts', function(req, res) {

});

app.get('contacts/:id.:format', function(req, res) {

})

app.put('contacts/:id.:format', function(req, res) {

})

app.del('contacts/:id.:format', function(req, res) {

})

app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
