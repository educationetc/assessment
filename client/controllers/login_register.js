Router.route('/auth', function() {
	console.log(Meteor.userId())
	BlazeLayout.render('app', {content: 'login_register'});
});