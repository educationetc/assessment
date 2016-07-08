import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var test;

Router.route('/:token/t', function() {

	test = Tests.findOne({token: this.params.token});

	if (!Session.get('student-id'))
		return BlazeLayout.render('app', {content: 'home', token: this.params.token});

	if (!test)
		return BlazeLayout.render('app', {content: 'home', error: 'Test not found', token: this.params.token});

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
			length = test.answers.length,
			percentage = numCorrect = 0;

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val();

		if (answers.includes('undefined'))
			return $('#error').text('Please fill out entire assessment');

		answers = answers.split('');

		for (var i = 0; i < answers.length; i++)
			if (answers[i] === test.answers[i]) {
				percentage += 100 / length;
				numCorrect++;
			}
		percentage = ~~percentage;	

		$('#error').text('');

		window.removeEventListener('blur', noCheating);

		Scores.insert({
			token: Session.get('token'),
			studentId: Session.get('student-id'),
			answers: answers,
			percentage: percentage,
			numCorrect: numCorrect,
			createdAt: Date.now()
		});

		BlazeLayout.render('app', {content: 'results', percentage: percentage, numCorrect: numCorrect, length: length});
	}
});

Template.assessment.onCreated(function () {
	window.addEventListener('blur', noCheating);
});

function noCheating() {
    $('#error').text('Do not leave the page or your test will be voided');;
}