
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

  validation: {
    email: {
      required: true,
      pattern: 'email',
      msg: 'Please enter a valid email address',
    },
    firstname: {
      required: true,
    },
    lastname: {
      required: true,
    },
    phone: 
      [{
        required: true,
        msg: 'Phone number cannot be left blank',
      }, {
        pattern: 'digits',
        msg: 'Please enter digits only',
      }, {
        minLength: 5,
        msg: 'Phone number should be at least 5 digits',
      }, {
        maxLength: 12,
        msg: 'Phone number can not exceed 12 digits',
      }],
    address: {
      required: true,
      msg: 'Please enter the contact\'s address',
    },
    group: {
      required: true,
      msg: 'Please give the contact a group',
    }
  },

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
  },

  events : {

  },

  constructor: function(attributes, options) {
    this.contacts = new Contacts(undefined, { groupname : attributes.groupname })
    this.contacts.group = this;

    Backbone.Model.prototype.constructor.call(this, attributes);
  },

  initialize: function() {
    
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
    });
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

    Backbone.Validation.bind(this);
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
    if (this.model.save(data, { validate : true })) {
      this.$el.html(this.template(this.model.toJSON()));
    }
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
    'click .delete' : 'clear'
  },

  constructor: function(options) {
    options.model.view = this;
    Backbone.View.prototype.constructor.call(this, options);
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model.contacts, 'remove', this.render)
    this.listenTo(this.model.contacts, 'add', this.render)
    this.listenTo(this.model.contacts, 'reset', this.render) 
  },
  

  render: function() {
    var j = this.model.toJSON();
    j['contactCount'] = this.model.contacts.length;
    this.$el.html(this.template(j));
    return this;
  },

  clear: function() {
    for (var i = this.model.contacts.length - 1; i >= 0; i--)
      this.model.contacts.at(i).destroy();

    this.model.destroy();
  },

  setFocus: function() {
    if (appView.selectedGroup != this) {
      if (appView.selectedGroup !== undefined)
        appView.selectedGroup.$el.removeClass('active');
      appView.selectedGroup = this;
      this.$el.addClass('active');
    }

    appView.renderGroup(this.model);
  }


});

_.extend(Backbone.Validation.callbacks, {
  valid: function(view, attr, selector) {

  },
  invalid: function(view, attr, error, selector) {
    view.$('.' + attr).qtip({
      content: error,
      position: {
        corner: {
          target: 'topRight',
          tooltip: 'bottomLeft'
        }
      },
      style: 'mstyle',
      show: {
        when: false,
        ready: true,
      },
      hide: {
        when: {
          event: 'unfocus',
        }          
      }
    });
  }
});

var AddView = Backbone.View.extend({
  
  el: $('.contact_form'),

  template: _.template($('#edit_template').html()),

  events: {
    "click a.ok": "addContact",
    "click a.cancel": "hideForm",
    "click a.show": "showForm",
    'click img.photo' : 'uploadPhoto'
  },

  initialize: function () {
    this.$('.form').html(this.template(this.model.toJSON())).hide();
    this.isShow = false;
    Backbone.Validation.bind(this);
  },

  render: function() {
    //this.$('.form').html(this.template(this.model.toJSON()));
    
    return this;
  },

  showForm: function(e) {
    e.preventDefault();

    this.clearForm();
    this.isShow = true;
    this.$('.form').show('fast');
    this.$('.show').hide('fast');
  },

  hideForm: function(e) {
    e.preventDefault();

    this.isShow = false;
    this.$('.form').hide('fast');
    this.$('.show').show('fast');
  },

  clearForm: function() {
    this.$('input:not(:radio)').each(function (i, el) {
      $(el).val('');
    });
  },

  addContact: function(e) {
    e.preventDefault();

    var data = this.$('form').serializeObject();
    
    if (this.model.set(data, { validate : true })) {
      var group = groups.where({ groupname : data.group });
      if (group.length == 0) {
        group = groups.create( { groupname : data.group } );
      } else {
        group = group[0];
      }
      group.contacts.create( data );

      this.clearForm();
      this.$('.form').hide('fast');
      this.$('.show').show('fast');

      if (appView.selectedGroup && appView.selectedGroup.model == group) {
        appView.renderGroup(group);
      }
    }
  },
  
  uploadPhoto: function(ev) {
    if (this.$('.upload_photo').val() != "") {

      formdata = new FormData();
      reader = new FileReader();
      file = this.$('.upload_photo').get(0).files[0];
      reader.readAsDataURL(file);
      formdata.append("file", file);

      $.ajax({
        type: "POST",
        url: "/upload_photo",
        processData: false,
        contentType: false,
        data: formdata
      }).done(function(msg) {
        if (msg != 'success') {
          this.$('img.photo').qtip({
            content: error,
            position: {
              corner: {
                target: 'topRight',
                tooltip: 'bottomLeft'
              }
            },
            style: 'mstyle',
            show: {
              when: false,
              ready: true,
            },
            hide: {
              when: {
                event: 'unfocus',
              }          
            }
          });
        } else {
          this.$('img.photo').attr('src', msg);
        }
      }); 
    }
  }

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

    this.contact_list = this.$('.contact_list ul');
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

var AppRouter = Backbone.Router.extend({

  routes: {
    'group/:groupname': 'hashgroup'
  },

  initialize: function() {

  }

});

var groups = new Groups();
var appView = new AppView();
var appRouter = new AppRouter();

appRouter.on('route:hashgroup', function(groupname) {
  var g = groups.where({ groupname : groupname });
  if (g.length != 0) {
    g[0].view.setFocus();
  }
})

Backbone.history.start();

});

