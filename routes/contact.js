
var Contact
  , Group;

exports.defineRoutes = function (mongoose, fn) {
  Contact = mongoose.model('Contact');
  Group = mongoose.model('Group');
  fn();
}

exports.create = function(req, res, next) {

  var group = Group.find({ groupname : req.body.group }, function(err, group) {

    if (group.length == 0) {
      group = new Group({
        groupname: req.body.group
      });
      group.contacts = new Array();
    } else {
      group = group[0];
    }

    var data = req.body;
    data.group = group.id;
    var contact = new Contact(data);

    group.contacts.push(contact.id)
    group.save(function(err, g) {
      if (err) { 
        next(err);
      } else {
        contact.save(function(err, c) {
          if (err) {
            next(err);
          } else {
            res.json(c);
          }
        });
      }
    });  
  })
};

exports.getAll = function(req, res) {
  if (req.query.groupid !== undefined) {
    Contact.find({ group: req.query.groupid }, function(err, contact) {
      res.json(contact);
    })
  } else {
    Contact.find({}, function(err, contact) {
      res.json(contact);
    })
  }
};

exports.getById = function(req, res, next) {
  Contact.findById(req.params.id, function(err, c) {
    if (err) {
      next(err);
    } else if (c) {    
      res.json(c);
    } else {
       next(new Error('Contact not found!'));
    }
  });
};

exports.updateById = function(req, res, next) {
  var data = req.body;

  Contact.findByIdAndUpdate(req.params.id, data, 
    function(err, c) {
      if (err) {
        next(err);
      } else if (c) {    
        res.json(c);
      } else {
         next(new Error('Contact not found!'));
      }
    });
};

exports.deleteById = function(req, res, next) {
  Contact.findByIdAndRemove(req.params.id, function(err, c) {
    if (err) {
      next(err);
    } else if (c) {
      res.send('success');
    } else {
      next(new Error('Contact not found!'));
    }
  });
};