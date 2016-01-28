Meteor.methods({
	deleteUser: function(userId) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to delete a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t delete yourself.');
		
		// remove the user
		Meteor.users.remove(userId);
	},

	addUserRole: function(userId, role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account already has the role ' + role);

		// add the user to the role
		Roles.addUsersToRoles(userId, role);
	},

	removeUserRole: function(userId, role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (user._id == userId)
			throw new Meteor.Error(422, 'You can\'t update yourself.');

		// handle invalid role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		// handle user already has role
		if (!Roles.userIsInRole(userId, role))
			throw new Meteor.Error(422, 'Account does not have the role ' + role);

		Roles.removeUsersFromRoles(userId, role);
	},

	addRole: function(role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		// handle existing role
		if (Meteor.roles.find({name: role}).count() > 0 )
			throw new Meteor.Error(422, 'Role ' + role + ' already exists.');

		Roles.createRole(role);
	},

	removeRole: function(role) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		// handle non-existing role
		if (Meteor.roles.find({name: role}).count() < 1 )
			throw new Meteor.Error(422, 'Role ' + role + ' does not exist.');

		if (role === 'admin')
			throw new Meteor.Error(422, 'Cannot delete role admin');

		// remove the role from all users who currently have the role
		// if successfull remove the role
		Meteor.users.update(
			{roles: role },
			{$pull: {roles: role }},
			{multi: true},
			function(error) {
				if (error) {
					throw new Meteor.Error(422, error);
				} else {
					Roles.deleteRole(role);
				}
			}
		);
	},

	updateUserInfo: function(id, property, value) {
		var user = Meteor.user();
		if (!user || !Roles.userIsInRole(user, ['admin']))
			throw new Meteor.Error(401, "You need to be an admin to update a user.");

		if (property !== 'profile.name')
			throw new Meteor.Error(422, "Only 'name' is supported.");

		obj = {};
		obj[property] = value;
		Meteor.users.update({_id: id}, {$set: obj});

	},

	sendEmail: function (to, from, subject, text) {
     

      // Let other method calls from the same client start running,
      // without waiting for the email sending to complete.
      this.unblock();

      Email.send({
        to: to,
        from: from,
        subject: subject,
        text: text
      });
    },

    makeItem: function(itemId){
    	var user = Meteor.user();
    	Items.update({_id:itemId}, {$set:{worker:user._id}}, function(error, result) {
    });
    },


    statusOneChanger: function(targetitem){
  		Items.update({_id:targetitem}, {$set:{statusOne:'green'}}, function(error, result) {
    });
    },


    statusTwoChanger: function(targetitem){
  		Items.update({_id:targetitem}, {$set:{statusTwo:'green'}}, function(error, result) {
    });
    },


    statusThreeChanger: function(targetitem){
  		Items.update({_id:targetitem}, {$set:{statusThree:'green'}}, function(error, result) {
    });
    },


    statusFourChanger: function(targetitem){
  		Items.update({_id:targetitem}, {$set:{statusFour:'green'}}, function(error, result) {
    });
    },


    statusFiveChanger: function(targetitem){
  		Items.update({_id:targetitem}, {$set:{statusFive:'green'}}, function(error, result) {
    });
    },


	negativeRating: function(itemId){
		Items.update({_id:itemId}, {$set:{rating:'bad'}}, function(error, result) {
    });
	},    

	positiveRating: function(itemId){
		Items.update({_id:itemId}, {$set:{rating:'good'}}, function(error, result) {
    });
	}

});

