import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var test, /* the test object */
	length, /* the length of the test */
	id; /* the _id of the current student response in the scores collection */

Router.route('/:token/t', function() {

	test = Tests.findOne({token: this.params.token});

	if (!Session.get('student-id'))
		return BlazeLayout.render('app', {content: 'home', token: this.params.token});

	if (!test) {
		error('Test not found.')
		return BlazeLayout.render('app', {content: 'home', token: this.params.token});
	}

	length = test.answers.length;

	if (!isMissingId()) /* this test has already been created, avoid two db entries */
		return;

	Scores.insert({
		testId: test._id,
		studentId: Session.get('student-id'),
		answers: (new Array(length)).fill('F'),
		percentage: 0,
		numCorrect: 0,
		createdAt: 0
	});

	BlazeLayout.render('app', {content: 'assessment', answers: new Array(length)});
})

Template.assessment.events({
	'submit #assessment-form' (e) {

		e.preventDefault();

		var res = processResponses(true);

		if (!res)
			return $('#error').text('Please fill out entire assessment');

		window.removeEventListener('blur', noCheating);

		if (isMissingId())
			return $('#error').text('Server connectivity lost');
		$('#error').text('');

		Scores.update(
			{
				_id: id
			},

			{
				$set: {
					answers: res.responses,
					percentage: res.percentage,
					numCorrect: res.numCorrect,
					createdAt: Date.now()
				}
			}
		);

		BlazeLayout.render('app', {content: 'results', percentage: res.percentage, numCorrect: res.numCorrect, length: length});
	},

	'change input' (e) {

		var res = processResponses(false);

		if (isMissingId())
			return $('#error').text('Server connectivity lost');
		$('#error').text('');

		Scores.update(
			{
				_id: id
			},

			{
				$set: {
					answers: res.responses,
					percentage: res.percentage,
					total: res.total,
					numCorrect: res.numCorrect
				}
			}
		);
	}
});

Template.assessment.onCreated(function () {
	window.addEventListener('blur', noCheating);
});

function noCheating() {
    $('#error').text('Do not leave the page or your test will be voided');;
}

function processResponses(mustBeCompleted) {
	
	var responses = '',
		percentage = numCorrect = total = 0;

	for (var i = 1; i < length + 1; i++)
		responses += $('input[name="q' + i + '"]:checked').val();

	if (responses.includes('undefined') && mustBeCompleted)
		return false;

	responses = responses.replace(/undefined/g, 'F'); /* F signifies a blank response */
	responses = responses.split('');

	for (var i = 0; i < length; i++) {
		if (responses[i] === 'F') continue;
		total++;
		if (responses[i] === test.answers[i]) numCorrect++;
	}

	percentage = Math.round(numCorrect / total * 100);

	return {percentage: percentage, responses: responses, numCorrect: numCorrect};
}

function isMissingId() {
	if (!id) {
		id = Scores.findOne({testId: test._id, studentId: Session.get('student-id')});
		if (id)
			id = id._id;
	}

	if (!id)
		return true;
}