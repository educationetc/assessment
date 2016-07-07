Router.route('/dashboard', function() {
	if(!Meteor.user())
		return BlazeLayout.render('app', {content: '404'});

	var tests = Tests.find({admin: Meteor.userId()}, {sort: {createdAt: -1}}).find().fetch();
	BlazeLayout.render('app', {content: 'manage', tests: tests});
})