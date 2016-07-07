Router.route('/:token', function() {
	var test = Tests.findOne({token: token}).fetch();

	if(!test)
		return BlazeLayout.render('app', {error: 'Test not found.'});

	BlazeLayout.render('app', {content: 'assessment', test: test});
})