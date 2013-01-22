
var Contact
  , Group;

exports.defineRoutes = function (mongoose, fn) {
  Contact = mongoose.model('Contact');
  Group = mongoose.model('Group');
  fn();
}

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

exports.getById = function(req, res) {
  Contact.findById(req.params.id, function(err, c) {
    res.json(c);
  });
};

exports.create = function(req, res, next) {

  var group = Group.find({ groupname : req.body.group }, function(err, group) {

    if (group.length == 0) {
      group = new Group({
        groupname: req.body.group
      });
    }

    var contact = new Contact({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      photo: req.body.photo,
      group: group.id
    });

    // TODO: change multiple save into atomic methods
    group.contacts.push(contact.id)
    group.save(function(err, g) {
      if (err) next(err);
    });
    contact.save(function(err, c) {
      if (err) {
        next(err);
      } else {
        res.json(c);
      }
    });    
  })
};

exports.update = function(req, res) {
  contact.findByIdAndUpdate(req.params.id, {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    photo: req.body.photo,
    group: group.id
  }, function(err, contact) {
    if (err) next(err);
    res.json(contact);
  });
};

exports.delete = function(req, res) {
  contact.findByIdAndUpdate(req.params.id, function(err, contact) {
    if (err) throw err;
  });
};