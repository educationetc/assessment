Router.route('/create', function() {
	if(!Meteor.user())
		return BlazeLayout.render('app', {content: '404'});

	var test = Tests.findOne({admin: Meteor.userId()});

	/*	validate test	*/
	if(!test)
		return BlazeLayout.render('app', {content: '404'});

	/*	validate that this assessment is authored by the current user	*/
	if(test.admin !== Meteor.userId())
		return BlazeLayout.render('app', {content: '404'});

	BlazeLayout.render('app', {content: 'asessment', test: test});
})