Router.route('/create', function() {
	if(!Meteor.user())
		return BlazeLayout.render('app', {error: '404'});

	BlazeLayout.render('app', {content: 'assessment'});
})

Template.cr