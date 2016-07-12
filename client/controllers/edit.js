import { Tests } from '../../mongo/tests.js';

Router.route('/:testId/edit', function() {

	this.wait(Meteor.subscribe('tests'));

	if (this.ready()) {
		if(!Meteor.user())
			return BlazeLayout.render('app', {error: '404'});

		var test = Tests.findOne({_id: this.params.testId});
		console.log(test)

		/*	validate test	*/
		if(!test)
			return BlazeLayout.render('app', {content: '404'});

		/*	validate that this assessment is authored by the current user	*/
		if(test.admin !== Meteor.userId())
			return BlazeLayout.render('app', {content: '404'});

		Session.set('questions', test.answers);

		BlazeLayout.render('app', {content: 'edit', test: test});
	} else {
		BlazeLayout.render('app', {content: 'spinner'});
	}
})

Template.edit.helpers({
	questions() {
		return Session.get('questions');
	},

	add(int) {
		return int + 1;
	}
})