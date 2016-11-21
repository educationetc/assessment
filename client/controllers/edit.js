import { Tests } from '../../mongo/tests.js';

Router.route('/:testId/edit', function() {

	this.wait(Meteor.subscribe('tests'));


	if (this.ready()) { //allows you to edit the test if you are the correct teacher
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
});

Template.edit.helpers({
	questions() { //gets questions
		return Session.get('questions');
	},

	check(a, b) { //checks if a and b are equal
		return a === b;
	}
});

Template.edit.events({
	'click #add-question'(e) { //allows you to add a question
		e.preventDefault();

		var questions = Session.get('questions');
		questions.push(null);

		Session.set('questions', questions);
	},

	'click #remove-question'(e) { //allows you to remove a question
		e.preventDefault();

		var questions = Session.get('questions');
		questions.pop();

		Session.set('questions', questions);
	},

	'submit #edit-assessment' (e) { //submits the edited assessment, checks for any errors
		e.preventDefault();

		var answers 	= '',
			length 		= $('.form-group').length - 1,
			name 		= $('input[name="name"]').val();

		if(!name)
			return error('Please name your test.');

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val();

		if (answers.includes('undefined'))
			return error('Please fill out entire assessment');

		var options = {
			testId: Session.get('testId'),
			name: name,
			answers: answers.split('')
		}

		Meteor.call('editTest', function(err, res) {
			if(err)
				return error(err);

			Router.go('/dashboard');
		});
	}
});