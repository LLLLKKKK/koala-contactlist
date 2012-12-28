String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

var Person = Backbone.Model.extend({

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
