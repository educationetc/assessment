import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var test, /* the test object */
	length; /* the length of the test */

Router.route('/:token/t', function() {
	BlazeLayout.render('app', {content: 'spinner'});

	var token = this.params.token;

	Meteor.call('getTest', this.params.token, function(err, res) {
		if(err)
			return error(err);

		test = res;

		if (!test) {
			error('Test not found.');
			Session.set('assessment-id-back', token);
			return Router.go('/');
		}

		if (!Session.get('student-id')) {
			Session.set('assessment-id-back', token);
			return Router.go('/');
		}

		length = test.answers.length;

		var options = {
			testId: test._id,
			studentId: Session.get('student-id'),
			answers: (new Array(length)).fill('F')
		}

		Meteor.call('insertScore', options, function(err, res) {
			if(err)
				return error(err);

			Session.set('score-id', res._id);

			console.log(res);
			console.log(res._id)

			BlazeLayout.render('app', {content: 'assessment', answers: new Array(length)});
		})
	})
});


Template.assessment.events({
	'submit #assessment-form' (e) {

		e.preventDefault();

		var res = processResponses(true);

		if (!res)
			return error('Please fill out entire assessment');

		window.removeEventListener('blur', cheating);
		window.removeEventListener('focus', doneCheating);

		var options = {
			_id: Session.get('score-id'),
			answers: res.responses,
			percentage: res.percentage,
			total: res.total,
			numCorrect: res.numCorrect,
			createdAt: Date.now()
		};

		Meteor.call('updateScore', options, function(err, response) {
			if(err)
				return error(err);

			BlazeLayout.render('app', {content: 'results', percentage: res.percentage, numCorrect: res.numCorrect, length: length});
		});
	},

	'change input' (e) {

		var res = processResponses(false);

		var options = {
			_id: Session.get('score-id'),
			answers: res.responses,
			percentage: res.percentage,
			total: res.total,
			numCorrect: res.numCorrect
		}

		Meteor.call('updateScore', options, function(err, res) {
			if(err)
				return error(err);
		});
	}
});

Template.assessment.onCreated(function () {
	window.addEventListener('blur', cheating);
	window.addEventListener('focus', doneCheating);
});

function cheating() {
    error('Do not leave the page or your test will be voided');
    Meteor.call('cheating', Session.get('score-id'), true);
}

function doneCheating() {
	Meteor.call('cheating', Session.get('score-id'), false);
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