

var Group;

exports.defineRoutes = function (mongoose, fn) {
  Group = mongoose.model('Group');
  fn();
}

exports.create =  function(req, res, next) {
  var group = new Group({
    groupname: req.body.groupname
  });
  group.save(function(err, g) {
    if (err) { 
      next(err);
    } else { 
      res.json(g);
    }
  });
};

exports.getAll = function(req, res) {
  Group.find({}, function(err, g) {
    res.json(g);
  });
};

exports.getById = function(req, res, next) {
  Group.findById(req.params.id, function(err, g) {
    if (g) {
      res.json(g);
    } else {
      next(new Error('Group not found!'))
    }
  });
};

exports.updateById = function(req, res, next) {
  Group.findByIdAndUpdate(req.params.id, { groupname: req.body.groupname }, function(err, g) {
    if (g) {
      res.json(g);
    } else {
      next(new Error('Group not found!'))
    }
  });
};

exports.deleteById = function(req, res, next) {
  Group.findByIdAndRemove(req.params.id, function(err, g) {
    if (g) {
      res.send('success');
    } else {
      next(new Error('Group not found!'))
    }
  });
};