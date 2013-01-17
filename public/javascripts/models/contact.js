
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
  
  constructor: function(attributes, options){
    this.localStorage = new Backbone.LocalStorage(options.groupname + "_contacts_storage");
    Backbone.Collection.prototype.constructor.call(this, attributes);
  },

  initialize: function() {
  
  }
  
});

var Group = Backbone.Model.extend({

  defaults: {
    groupname: "",
    contactCount: 0
  },

  events : {

  },

  constructor: function(attributes, options) {
    this.contacts = new Contacts(undefined, { groupname : attributes.groupname })

    Backbone.Model.prototype.constructor.call(this, attributes);

    this.listenTo(this.contacts, 'change', this.updateCount)
  },

  clear: function() {
    this.contacts.destroy();
    this.destroy();
  },

  updateCount: function() {
    //this.contactCount = this.contacts.length;
    this.save( { contactCount : this.contacts.length });
    if (this.contacts.length == 0)
      this.clear();
  }

});

var Groups = Backbone.Collection.extend({
  
  model: Group,

  localStorage: new Backbone.LocalStorage("groups_storage"),

  initialize: function() {
    
  },

  fetchAllContacts: function(){
    this.each(function(g){
      g.contacts.fetch();
    })  
  }

});

var ContactView = Backbone.View.extend({

  tagName : 'li',

  template : _.template($('#contact_template').html()),

  edit_template: _.template($('#edit_template').html()),

  events : {
    'click a.edit' : 'edit',
    'click a.delete' : 'clear',
    'click a.ok' : 'save',
    'click a.cancel' : 'cancel'
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

  save: function() {
    var data = this.$('form').serializeObject();
    this.model.save(data);
    this.$el.html(this.template(this.model.toJSON()));
  },

  cancel: function() {
    this.$el.html(this.template(this.model.toJSON()));
  },

  clear: function() {
    this.model.destroy();
  }
  
});

var GroupView = Backbone.View.extend({
  
  tagName: 'li',

  template : _.template($('#group_template').html()),

  events: {
    'click a' : 'setFocus'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },
  

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  setFocus: function() {
    if (AppView.selectedGroup != this) {
      if (AppView.selectedGroup !== undefined)
        AppView.selectedGroup.$el.removeClass('active');
      AppView.selectedGroup = this;
      this.$el.addClass('active');
    }

    appView.renderGroup(this.model);
  }


});

var AddView = Backbone.View.extend({
  
  el: $('.contact_form'),

  template: _.template($('#edit_template').html()),

  events: {
    "click a.ok": "addContact",
    "click a.cancel": "hideForm",
    "click a.show": "showForm"
  },

  initialize: function () {
    this.$('.form').html(this.template(this.model.toJSON())).hide();
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
  },

  addContact: function(e) {
    e.preventDefault();

    var data = this.$('form').serializeObject();
    
    var group = groups.where({ groupname : data.group });
    if (group.length == 0) {
      group = groups.create( { groupname : data.group } );
      group.contacts.create( data );
    } else {
      group[0].contacts.create( data );
    }

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

  events: {
    
  },

  initialize : function() {
    this.addView = new AddView( { model : new Contact() } );

    this.listenTo(groups, 'add', this.addOneGroup);
    this.listenTo(groups, 'reset', this.addAllGroup);
    _.bindAll(this);

    groups.fetch();
    groups.fetchAllContacts();

    this.contact_list = $('.contact_list ul');
  },


  addOneContact: function(contact) {
    var view = new ContactView({ model : contact });
    this.contact_list.append(view.render().el);
  },

  renderGroup: function(group) {
    this.contact_list.html('');
    group.contacts.each(this.addOneContact, this);
  },

  addOneGroup: function(group) {
    var view = new GroupView({ model : group });
    this.$('.group-sidenav ul').append(view.render().el);
  },

  addAllGroup: function() {
    groups.each(this.addOneGroup);
  }  

});


var groups = new Groups();
var appView = new AppView();

});

