
var express = require('express')
  , mongoose = require('mongoose')
  , crypto = require('crypto')
  , fs = require('fs')
  , routes = require('./routes')
  , group = require('./routes/group')
  , contact = require('./routes/contact')
  , path = require('path')
  , models = require('./models')
  , Contact
  , Group;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('image types', ['image/png', 'image/gif', 'image/pjpeg', 'image/jpeg']);
  app.set('image size', 1024 * 500);

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(logErrors);
  app.use(errorHandler);
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

//TODO: write an error page and render
function errorHandler(err, req, res, next) {
  res.status(500);
  res.json({ error : err })
}

app.configure('development', function(){
  app.set('db-uri', 'mongodb://localhost/contactlist-development');
  app.use(express.errorHandler({ dumpExceptions: true }));
});

app.configure('production', function() {
  app.set('db-uri', 'mongodb://localhost/contactlist');
})

models.defineModels(mongoose, function() {
  app.Contact = Contact = mongoose.model('Contact');
  app.Group = Group = mongoose.model('Group');
  db = mongoose.connect(app.get('db-uri'));
});

group.defineRoutes(mongoose, function() {
  app.post('/groups', group.create);
  app.get('/groups', group.getAll);
  app.get('/groups/:id', group.getById);
  app.put('/groups/:id', group.updateById);
  app.del('/groups/:id', group.deleteById);
});

contact.defineRoutes(mongoose, function() {
  app.post('/contacts', contact.create);
  app.get('/contacts', contact.getAll);
  app.get('/contacts/:id', contact.getById);
  app.put('/contacts/:id', contact.updateById);
  app.del('/contacts/:id', contact.deleteById);
});

app.get('/', routes.index);

app.post('/photo', function(req, res, next) {
  if (req.files && req.files.photo) {
    if (req.files.photo.size <= app.get('image size') &&
      app.get('image types').indexOf(req.files.photo.type) != -1 ) {

      var new_name = function() {
        var formal_name = req.files.photo.name;
        var e_name = formal_name.substring(formal_name.lastIndexOf('.'), formal_name.length);
        var d = new Date();
        var sha1 = crypto.createHash('sha1').update(formal_name + d.getTime());
        var p_name = sha1.digest('hex');
        return p_name + e_name;
      }();

      var target_path = './public/images/upload/' + new_name;
      var link = '/images/upload/' + new_name;
      fs.rename(req.files.photo.path, target_path, function(err) {
        if (!err) {
          res.send(link);
        } else {
          fs.unlink(req.files.photo.path);
          next(new Error('Invalid'));
        }
      });
    } else {
      next(new Error('Invalid'))
    }
  } else {
    next(new Error('Invalid'))
  }

});


app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
