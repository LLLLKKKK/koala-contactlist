
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
  /*,

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
  */  
});

var Contacts = Backbone.Collection.extend({
  
  model: Contact,
  
  localStorage: new Backbone.LocalStorage("group_storage"),
  
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

  events : {

  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
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
    var group = groups.where(data.group);
    if (group.length == 0) {
      group = groups.create( { groupname : data.group } );
    }
    group.contacts.create( data );
    
    this.clearForm();
    this.$('.contact_form').hide('fast');
    this.$('.show').show('fast');
  }/*,

  appendContact: function(contact) {
    var group = _.find(groupList.models, function(model){
      if(model.get('groupname') == contact.get('group').toLowerCase())
          return model;
    });
    if( 
      (group != undefined && $('#sidebar li#group_' + group.get('id')).hasClass('active')) ||
      ($('#sidebar li#group_0').hasClass('active')) 
      ) {
      var view = new PersonView({model: contact});
      $("#contact_list").prepend(view.render().el);
    }
  },*/
/*
    initializeList: function() {
        personList.each(function(contact){
             var view = new PersonView({model: contact});
                $("#contact_list").prepend(view.render().el);
        });
       
    },
*//*
  errorHandler: function(invalid) {
    for(x in invalid) {
      
      this.$(x).qtip({
        content: invalid[x],
        style: {
          name: 'red',
        },
        show: {
          when: false,
          ready: true,
        },
        hide: {
          when: {
              event: 'focus',
          }   
        }
      });

      this.$(x).addClass('warning');
    }  
  },

    successHandler: function(model, response) {
        $("#add_form input:not(:radio)").each(function (i, el) {
            $(el).val('');
        });
        $("#add_form img.photo").attr('src', 'images/dummy.png')

        $('#add_form #person_form').hide('fast').addClass('add_border');
        $('#add_button').show('fast');
    },
    */    
/*
    callUpload: function() {
        $('#add_form #person_form input[type="file"]').click();
    },
    
  uploadPhoto: function(ev) {
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

    initialize : function() {
      this.addView = new AddView( { model : new Contact() } );
      this.groupView = new GroupView();

      this.listenTo(groups, 'add', this.addOneGroup);
    },

    addOneGroup: function() {

    }
  });

  var groups = new Groups();
  var appView = new AppView();
});

