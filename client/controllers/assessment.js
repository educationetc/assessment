Router.route('/:token', function() {
	var test = Tests.findOne({token: token}).fetch();

	if(!test)
		return BlazeLayout.render('app', {content: '404'});

	BlazeLayout.render('app', {content: 'assessment', test: test});
})