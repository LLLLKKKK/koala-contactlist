var GroupView = Backbone.View.extend({
    events: {
    },

    initialize: function() {
		groupList.bind('add', this.appendGroup, this);
		groupList.bind('reset', this.updateAllGroup, this);
		groupList.fetch();

		if(groupList.length == 0) {
			groupList.create({groupname: 'all', id: 0});
		}
		$('#sidebar ul > div:first-child li').addClass('active');
    },
	
	appendGroup: function(group) {
		var view = new GroupActionView({model: group});
        $('#sidebar ul').append(view.render().el);
	},
	
	updateAllGroup: function() {
		groupList.each(this.appendGroup);
	},

	
});

var GroupActionView = Backbone.View.extend({
	events: {
    	"click li": "retrivePersonList",
 
    },

    initialize: function() {
    	personList.bind('add', this.updateGroup, this);
    },

	render: function() {
		template = _.template($('#group_template').html());
        this.$el.html(template(this.model.toJSON()));
        return this;
	},
	retrivePersonList: function() {
		$('#sidebar ul li').removeClass('active');
		$('#sidebar ul').find('li#group_' + this.model.get('id')).addClass('active');

		this.appendAllContact(this.model);
	},

    appendAllContact: function(group) {
        $('#contact_list').html('');
        personList.each(function(contact){
            // check if group is active
            var cond_1 = $('#sidebar li#group_' + group.get('id')).hasClass('active');
            // check if the contact is in the list
            var cond_2 = group.get('groupname') == contact.get('group').toLowerCase();
            // or if the active group is "all"
            var cond_3 = group.get('groupname') == 'all';
            if( (cond_1 && cond_2) || cond_3 ) {
                var view = new PersonView({model: contact});
                $("#contact_list").prepend(view.render().el);
            }
        });
    },

    updateGroup: function(person) {
		var groupname = person.get('group').toLowerCase();

		if(groupname != '' && !groupList.contains(groupname)) {
			var size = groupList.length;
			groupList.create({groupname: groupname, id: size, order: 1});
		}
		else {
			var groupID = _.find(groupList.models, function(model)
				{ 
					return model.get('groupname') == groupname;
				}).id;
			var size = _.countBy(personList.models, function(model)
				{
					return model.get('group').toLowerCase() == groupname;
				}).true;
			size = size == undefined ? 0 : size;
			
			// size has to be greater or equal to 1 because we already have the group in the groupList
			groupList.at(groupID).set({order: size});
			groupList.at(groupID).save();
			var active = false;
			if($('#sidebar ul li#group_' + groupID).hasClass('active')) active = true;
			var viewCurrent = new GroupActionView({model: groupList.at(groupID)});
			$('#sidebar ul li#group_' + groupID).parent().replaceWith(viewCurrent.render().el);
			if(active)
				$('#sidebar ul li#group_' + groupID).addClass('active');
		}

		var active = false;
		if($('#sidebar ul li#group_0').hasClass('active')) active = true;
		groupList.at(0).set({order: personList.length});
		groupList.at(0).save();
		var viewAll = new GroupActionView({model: groupList.at(0)});
		$(this.el).find('li#group_0').parent().replaceWith(viewAll.render().el);
		if(active)
			$('#sidebar ul li#group_0').addClass('active');
	},

});

$(function(){
    new GroupView({ el: '#sidebar ul' });
    new GroupActionView({ el: '#group_template'});
})
