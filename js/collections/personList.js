window.PersonList = Backbone.Collection.extend({
	
    model: Person,

    localStorage: new Backbone.LocalStorage("contact_storage"),

    initialize: function(){
	},

});


var personList = new PersonList();