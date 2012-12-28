var PersonView = Backbone.View.extend({
    
    tagName : "li",

    events: {
        "click a.delete": "clear",
        "click a.edit": "edit",
        "click": "expand",
        "click a.ok": "saveEdits",
        "click a.cancel": "cancelEdits",
        "change .upload_photo": "uploadPhoto"          
    },

    initialize: function() {
        Backbone.Validation.bind(this);
    },

    render: function() {
        var template = _.template($('#contact_template').html());
        this.$el.html(template(this.model.toJSON()));
        return this;
    },

    clear: function(e) {
        e.preventDefault();

        /* Ugly codes to update the group*/
        var groupname = this.model.get('group');

        var groupID = _.find(groupList.models, function(model)
            { 
                return model.get('groupname') == groupname;
            }).id;
        
        var newSize = groupList.at(groupID).get('order') - 1;

        //TODO: Delete the group when no person in the group        
        groupList.at(groupID).set({order: newSize});
        groupList.at(groupID).save();

        var viewCurrent = new GroupActionView({model: groupList.at(groupID)});
        $('#sidebar ul li#group_' + groupID).parent().replaceWith(viewCurrent.render().el);
        /* Ugly codes end*/

        this.model.destroy();
        this.remove();

        /* Ugly codes again*/
        groupList.at(0).set({order: personList.length});
        groupList.at(0).save();
        var viewAll = new GroupActionView({model: groupList.at(0)});
        $('#sidebar ul li#group_0').parent().replaceWith(viewAll.render().el);        
        /* Ugly codes end*/
    },

    expand: function() {
        var detailed = this.$('.detailed_info');
        if(detailed.is(':hidden'))
            detailed.show('fast');
        else
            detailed.hide('fast');      
    },

    edit: function(ev) {
        ev.preventDefault();
        var editTemplate = _.template($('#edit_template').html());
        this.$el.html(editTemplate(this.model.toJSON()));
        this.$el.addClass('editing');
        $('#add_form .cancel').click();
        // It's ugly, but necessary
        this.$el.find('input:radio[class='+this.model.get('gender')+']').attr('checked', 'true');
        this.$el.find('form').show('fast');
        this.$el.find('img').bind('click', this.callUpload);
    },

    saveEdits: function(ev) {
        ev.preventDefault();
        
        var formData = {};

        $(ev.target).closest('form').find("input:not(:file):not(:radio)").each(function (i, el) {
            formData[el.id] = $(el).val();
        });
        formData["gender"] = $(ev.target).closest('form').find('input:radio[name=gender]:checked').val();
        formData["photo"] = $(ev.target).closest('form').find('img.photo').attr('src');

        var old = this.model.clone();
                
        var invalid = this.model.validate(formData, {});
        if(!invalid) {
            var view = new GroupActionView();
            
            this.model.set(formData);
            this.model.save();
            this.$el.find('img').unbind('click', this.callUpload);
            this.$el.remove('editing');
            this.render();

            // update the older group the model belongs to
            view.updateGroup(old);

            //update the new group the model belongs to
            view.updateGroup(this.model);

            //destroy all qtips
            $('body .qtip').qtip();
            $('body .qtip').qtip('destroy');
        }
        else {
            this.errorHandler(invalid);
        }
    },

    cancelEdits: function(ev) {
        ev.preventDefault();
        this.$el.find('img').unbind('click', this.callUpload);
        this.$el.find('.errorInf').html('');
        this.$el.remove('editing');

        //destroy all qtips
        $('body .qtip').qtip();
        $('body .qtip').qtip('destroy');

        this.render();
    },

    callUpload: function(ev) {
        $(ev.target).closest('form').find('input[type="file"]').click();
    },
    
    uploadPhoto: function(ev) {
        var photo_el = $(ev.target).closest('.upload_photo');

        if (photo_el.val() != "") {
            formdata = new FormData();
            reader = new FileReader();
            file = photo_el.get(0).files[0];
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
                    $(ev.target).closest('form').find('.errorInf').html(msg);
                } else {
                    $(ev.target).closest('form').find('img.photo').attr('src', msg);
                    $(ev.target).closest('form').find('.errorInf').html("");
                }   
            }); 
        }     
    },

    errorHandler: function(error) {
        for(x in error) {
            $('#contact_list #person_form #' + x).qtip({
                content: error[x],
                style: {
                    name: 'red',
                },
                show: {
                    when: false,
                    ready: true,
                },
                hide: {
                    when: {
                        event: 'click',
                    }
                    
                }
            });
            $('#person_form #' + x).addClass('warning');
        }  
    }
});
