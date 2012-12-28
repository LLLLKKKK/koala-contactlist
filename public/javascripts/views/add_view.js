var AddView = Backbone.View.extend({
    model: Person,
    events: {
        "click a.ok": "createContact",
        "click a.cancel": "cancelCreate",
        "click a#add_button": "showForm",
        "change .upload_photo": "uploadPhoto",
        "click img" : "callUpload"
    },

    initialize: function () {
        personList.bind('add', this.appendContact, this);
        personList.bind('reset', this.initializeList, this);
        personList.model.bind('error', this.deleteError, this);
        personList.fetch();
    },

    createContact: function(e) {
        e.preventDefault();

        //destroy all qtips
        $('body .qtip').qtip();
        $('body .qtip').qtip('destroy');


        $('#add_form input').removeClass('warning');
        var formData = {};
        $("#add_form input:not(:file):not(:radio)").each(function (i, el) {
            formData[el.className] = $(el).val().trim();
        });

        formData["gender"] = $('#add_form input:radio[name=gender]:checked').val();
        formData["photo"] = $('#add_form img.photo').attr('src');
        this.model = new Person(formData);
        Backbone.Validation.bind(this);
        var invalid = this.model.validate();
        if(!invalid)
            personList.create(formData, {success: this.successHandler});
        else {
            this.errorHandler(invalid);
        }
            
    },

    cancelCreate: function(e) {
        e.preventDefault();
        $('#add_form #person_form').hide('fast');
        $("#add_form input:not(:radio)").each(function (i, el) {
            $(el).val('');
        });
        $('#add_form input').removeClass('warning');

        //destroy all qtips
        $('body .qtip').qtip();
        $('body .qtip').qtip('destroy');

        $('#add_button').show('fast');
    },

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
    },

    initializeList: function() {
        personList.each(function(contact){
             var view = new PersonView({model: contact});
                $("#contact_list").prepend(view.render().el);
        });
       
    },

    errorHandler: function(invalid) {
        for(x in invalid) {
            $('#add_contact #person_form .' + x).qtip({
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
            $('#person_form #' + x).addClass('warning');
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

    callUpload: function() {
        $('#add_form #person_form input[type="file"]').click();
    },
    
    uploadPhoto: function(ev) {
        if ($('#add_form .upload_photo').val() != "") {
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
    },

    showForm: function(ev) {
        ev.preventDefault();
        if ($('#add_form').find('#person_form').length == 0) {
            var editTemplate = _.template($('#edit_template').html());
            $('#add_form').html(editTemplate( (new Person).toJSON()));
            $('#add_form #person_form');
        }
        $('#add_form #person_form').show('fast');
        $('#add_button').hide('fast');
        $('#contact_list #person_form .cancel').click();
    }
});


$(function(){
    new AddView({ el: '#add_contact'});
});
