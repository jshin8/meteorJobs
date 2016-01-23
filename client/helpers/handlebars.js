Handlebars.registerHelper('isAdminUser', function() {
	return Roles.userIsInRole(Meteor.user(), ['admin']);
});

UI.registerHelper('isLoggedIn', function() {
  return !!Meteor.user();
});