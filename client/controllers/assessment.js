import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

Router.route('/:token', function() {

	var test = Tests.findOne({token: this.params.token});

	if (!Session.get('student-id'))
		return BlazeLayout.render('app', {content: 'home', token: this.params.token});

	if (!test)
		return BlazeLayout.render('app', {error: 'Test not found'});

	BlazeLayout.render('app', {content: 'assessment', answers: new Array(test.answers.length)});
})

Template.assessment.helpers({
	add (int) {
		return int + 1;
	}
});

Template.assessment.events({
	'submit #assessment-form' (e) {

		e.preventDefault();

		var answers = '',
			length = $('input').length / 5;

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val();

		console.log(length);

		if (answers.includes('undefined'))
			return $('#error').text('Please fill out entire assessment');

		$('#error').text('');

		Scores.insert({
			token: Session.get('token'),
			studentId: Session.get('student-id'),
			answers: answers.split(''),
			createdAt: Date.now()
		});

		BlazeLayout.render('app', {content: 'results'})
	}
});