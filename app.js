
var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , http = require('http')
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
  app.set('image size', 200 * 1024);

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
  res.render('error', { error : err })
}

app.configure('test', function(){
  app.set('db-uri', 'mongodb://localhost/contactlist-test');
  app.use(express.errorHandler({ dumpExceptions: true }));
});

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

app.get('/', routes.index);

app.post('groups/', function(req, res) {

});

app.get('groups/:id.:format', function(req, res) {

});

app.get('/contacts/', function(req, res) {
  if (req.query.groupid !== undefined) {
    Contact.find({ group: req.query.groupid }, function(err, contact) {
      res.json(contact.toObject());
    })
  } else {

  }
})

app.get('contacts/:id', function(req, res) {
  Contact.find({ _id: req.params.id }, function(err, contact) {
    res.json(contact.toObject());
  });
})

app.post('/contacts.:format', function(req, res) {
  var contact = new Contact({
    firstname: req.firstname,
    lastname: req.lastname,
    gender: req.gender,
    phone: req.phone,
    address: req.address,
    photo: req.photo,
    group: req.group
  });

  contact.save(function(err, contact) {
    if (err) {
      next(err);
    } else {
      switch (req.params.format) {
        default:
        case 'json':
          res.send(contact.toObejct());
          break;
      }
    }
  });
});

app.put('contacts/:id.:format', function(req, res) {
  contact.findByIdAndUpdate(req.params.id, {
    firstname: req.firstname,
    lastname: req.lastname,
    gender: req.gender,
    phone: req.phone,
    address: req.address,
    photo: req.photo,
    group: req.group
  }, function(err, contact) {
    if (err) next(err);
  });

})

app.del('contacts/:id.:format', function(req, res) {
  contact.findByIdAndUpdate(req.params.id, function(err, contact) {
    if (err) next(err);
  });
})

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


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

module.exports = app;
