
$(function(){

var Contact = Backbone.Model.extend({

  defaults: {
    firstname:"",
    lastname: "",
    phone: "",
    gender: "",
    address: "",
    email: "",
    group: "",
    photo:"images/dummy.png"
  },
  
  initialize: function(){

  },

  clear: function() {
      this.destroy();
  }

});

var Contacts = Backbone.Collection.extend({
  
  model: Contact,
  
  localStorage: new Backbone.LocalStorage("contacts_storage"),
  
  initialize: function(){
        
  },
  
});

var Group = Backbone.Model.extend({

  defaults: {
    groupname: "", 
    count: 0
  },
  
  contacts : new Contacts(),

  initialize: function() {
    //this.on('change', this.updateCount);
  },

  clear: function() {
    this.destroy();
  },
  
  updateCount: function() {
    this.count = this.Contacts.length;
  }

});

var Groups = Backbone.Collection.extend({
  
  model: Group,

  localStorage: new Backbone.LocalStorage("groups_storage"),

  initialize: function() {
    
  },

});

var ContactView = Backbone.View.extend({

  tagName : 'li',

  template : _.template($('#contact_template').html()),

  edit_template: _.template($('#edit_template').html()),

  events : {
    'click a.edit' : 'edit',
    'click a.delete' : 'clear'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  edit: function() {
    this.$el.html(this.edit_template(this.model.toJSON()));
  },

  clear: function() {
    this.model.destroy();
  }
  
});

var GroupView = Backbone.View.extend({
  
  el : $('group-sidenav ul'),

  template : _.template($('#group_template').html()),

  events: {
  },

  initialize: function() {
   // this.listenTo(groups, 'add', this.addOne);
    //this.listenTo(groups, 'reset', this.addAll)
    //this.listenTo(groups, 'all', this.render)
  },
  

  render: function() {

  },

  addOne: function() {
    this.el.append(this.template({ groupname : this.model.groupname, count : this.model.count }))
  },
  
  addAll: function() {

  },

  updateAllGroup: function() {
    groupList.each(this.appendGroup);
  },
  
});

var AddView = Backbone.View.extend({
  
  el: $('.contact_form'),

  template: _.template($('#edit_template').html()),

  events: {
    "click a.ok": "addContact",
    "click a.cancel": "hideForm",
    "click a.show": "showForm"/*,
    "change .upload_photo": "uploadPhoto",
    "click img" : "callUpload"*/
  },

  initialize: function () {
    this.$('.form').html(this.template(this.model.toJSON())).hide();
  

  },

  render: function() {
    //Backbone.Validation.bind(this);
    return this;
  },

  showForm: function(e) {
    e.preventDefault();

    this.clearForm();
    this.$('.form').show('fast');
    this.$('.show').hide('fast');
  },

  hideForm: function(e) {
    e.preventDefault();

    this.$('.form').hide('fast');
    this.$('.show').show('fast');
  },

  clearForm: function() {
    this.$('input:not(:radio)').each(function (i, el) {
      $(el).val('');
    });
        
    this.$('input').removeClass('warning');

    // destroy all gtips
  },

  addContact: function(e) {
    e.preventDefault();
    /*
    var data = this.$('form').serializeObject();
    this.model = new Person(formData);

    var invalid = this.model.validate();
    if(!invalid)
      personList.create(formData, {success: this.successHandler});
    else {
      this.errorHandler(invalid);
    } */
    var data = this.$('form').serializeObject();
    contacts.create(data);
    /*
    var group = groups.where(data.group);
    if (group.length == 0) {
      group = groups.create( { groupname : data.group } );
    }
    group.contacts.create( data );
    */
    this.clearForm();
    this.$('.form').hide('fast');
    this.$('.show').show('fast');
  }

    
 /* uploadPhoto: function(ev) {
    if ($this.('.upload_photo').val() != "") {
 
      formdata = new FormData();
      reader = new FileReader();
      file = $('#add_form .upload_photo').get(0).files[0];
      reader.readAsDataURL(file);
      formdata.append("file", file);

      $.ajax({
        type: "POST",
        url: "upload_file.php",
        processData: false,
        contentType: false,
        data: formdata
      }).done(function(msg) {
        if (msg.charAt(0) != 'i') {
            $('#add_form .errorInf').html(msg);
        } else {
            $('#add_form img.photo').attr('src', msg);
            $('#add_form .errorInf').html("");
        }
      }); 
    }
  },*/
  });

  var AppView = Backbone.View.extend({

    el: $('#contact-list-app'),

    initialize : function() {
      this.addView = new AddView( { model : new Contact() } );
      //this.groupView = new GroupView();

      this.listenTo(contacts, 'add', this.addOneContact)
      //this.listenTo(groups, 'add', this.addOneGroup);

    },

    addOneGroup: function() {

    },

    addOneContact: function(contact) {
      var view = new ContactView({ model : contact });
      this.$('.contact_list ul').append(view.render().el);
    }

  });

  var contacts = new Contacts();
  var groups = new Groups();
  var appView = new AppView();
});

