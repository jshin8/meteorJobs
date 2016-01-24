//home route
FlowRouter.route('/', {
  name: 'home',
  action: function () {
    BlazeLayout.render('layout', {content: 'home'});
  }
});

//admin routes
FlowRouter.route('/admin', {
  action: function () {
    BlazeLayout.render('layout', {content: 'accountsAdmin'});
  }
});


//client routes
FlowRouter.route('/itemhistory', {
  action: function () {
    BlazeLayout.render('layout', {content: 'itemList'});
  }
});



//redirects to '/' when logged out
 Tracker.autorun(function () {
  if (!(Meteor.userId())){
  	FlowRouter.go('home');
  }
});







// Router.configure({
// 	layoutTemplate: 'layout'
// });

// Router.map(function() {
// 	this.route('home', {
// 		path: '/',
// 		template: 'home'
// 	});

// 	this.route('admin', {
// 		path:'/admin',
// 		template: 'accountsAdmin',
// 		onBeforeAction: function() {
// 			if (Meteor.loggingIn()) {
// 				this.render(this.loadingTemplate);
// 			} else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
// 				console.log('redirecting');
// 				this.redirect('/');
// 			} else {
// 				this.next();
// 			}
// 		}
// 	});
// });