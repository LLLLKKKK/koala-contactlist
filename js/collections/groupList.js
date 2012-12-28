window.GroupList = Backbone.Collection.extend({
	model: Group,
	
	localStorage: new Backbone.LocalStorage("group_storage"),
	
    initialize: function(){
    		
	},

	contains: function(groupname) {
		for(i = 0; i < this.length; i++) {
			if(this.at(i).get('groupname').toLowerCase() == groupname.toLowerCase())
				return true
		}
		return false;
	},
});


var groupList = new GroupList();
