
var Contact
  , Group;

exports.defineRoutes = function (mongoose, fn) {
  Contact = mongoose.model('Contact');
  Group = mongoose.model('Group');
  fn();
}

exports.create = function(req, res, next) {
  var data = req.body;
  var contact = new Contact(data);
  var group = Group.find({ groupname : data.groupname }, function(err, group) {
    
    if (group.length == 0) {
      group = new Group({
        groupname: data.groupname,
        contacts: [ contact.id ]
      });
    } else {
      group = group[0];
      group.contacts.push(contact.id);
    }
    
    group.save(function(err, g) {
      if (err) { 
        next(err);
      } else {
        contact.group = g.id;
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
/*
  Contact.findById(req.params.id, function(err, c) {
    if (c) {
      if (data.groupname) {
        Group.find({ groupname: data.groupname }, function(err, g) {
          if (g) {
            if (g.groupname != data.groupname) {    // group changed
              g.contacts.push(c);
              g.save(function(err, g)) 
            }
          } else {    // no coresponding group found
            group = new Group({
              groupname: data.groupname
            });
            group.contacts = new Array();
            
            Contact.findById(req.params.id, function(err, c))

            group.contacts.push()
            group.save(function(err, g) {
              if (err) { 
                next(err);
              } else {
                contact.save(function(err, c) {
                  if (err) {
                    next(err);
                  } else {
                    data.group
                  }
                });
              }
            });
          }
        });
      }
      c.save(function(err, c) {
        if (err) {
          next(err);
        } else {
          res.json(c);
        }
      })
    } else {
      next(new Error('Contact not found!'));
    }
  });

  if (data.groupname) {

  }
*/
  delete data._id;
  console.log(data);
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