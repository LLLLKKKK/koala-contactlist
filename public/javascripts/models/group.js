window.Group = Backbone.Model.extend({
    el: '#sidebar ul li#group_',
	defaults: function(){
        return {
            groupname: "",
            order: 0,
        };
    },
	
	initialize: function(){
	},

    clear: function() {
        this.destroy();
    },

    getList: function(groupname) {
        if(groupname.toLowerCase() == "all") return personList;
        var filteredList = new PersonList();
        for(i = 0; i < personList.length; i++) {
            var group = personList.at(i);
            if(group.get('group').toLowerCase() == groupname.toLowerCase())
                filteredList.add(group);
        }
        return filteredList;
    },
    
});
