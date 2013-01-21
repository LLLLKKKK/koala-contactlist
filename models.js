
var Contact
  , Group;

function defineModels(mongoose, fn) {

  var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Model = mongoose.model;

  var Contact = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    photo: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    group: { type: ObjectId, ref: 'Group', required: true }
  })

  var Group = new Schema({
    groupname: { type: String, required: true },
    contacts: [ { type: ObjectId, ref: 'Contact' } ]
  })

  mongoose.model('Contact', Contact);
  mongoose.model('Group', Group);

  fn();

}

exports.defineModels = defineModels;