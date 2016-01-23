Meteor.startup(function() {
	// create an admin user if they don't already exist
	if (Meteor.users.find({username: 'admin'}).count() < 1) {
		Accounts.createUser({
			'username': 'admin',
			'email': 'admin@test.com',
			'password': 'admin'
		});
		Roles.addUsersToRoles(Meteor.users.find({username: 'admin'}).fetch(), ['admin']);
	}
	
});
