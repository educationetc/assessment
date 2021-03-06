import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js'; //imports mongoDB

var test, /* the test object */
	length; /* the length of the test */

Router.route('/:token/t', function() {
	BlazeLayout.render('app', {content: 'spinner'}); //spinner isn't currently implemented

	var token = this.params.token;

	Meteor.call('getTest', this.params.token, function(err, res) { //attempts to retrieve proper app
		if(err)
			return error(err);

		test = res;

		if (!test) { //if it can't find the test, it says the test can't be found and goes back
			error('Test not found.');
			Session.set('assessment-id-back', token);
			return Router.go('/');
		}

		if (!Session.get('student-id')) { //if the student id isn't correct, it goes back
			Session.set('assessment-id-back', token);
			return Router.go('/');
		}

		length = test.answers.length;

		var options = { //creates the options of the tests
			testId: test._id,
			studentName: Session.get('student-name'),
			studentId: Session.get('student-id'),
			answers: (new Array(length)).fill('F')
		}

		Meteor.call('insertScore', options, function(err, res) { //logs results
			if(err)
				return error(err);

			Session.set('score-id', res);

			console.log(res);

			BlazeLayout.render('app', {content: 'assessment', answers: new Array(length)});
		})
	})
});


Template.assessment.events({
	'submit #assessment-form' (e) { //procedures it goes through when the form is submitted

		e.preventDefault();

		var res = processResponses(true); //checks whether the entire test is finished

		if (!res)
			return error('Please fill out entire assessment');

		window.removeEventListener('blur', cheating);
		window.removeEventListener('focus', doneCheating);

		var options = { //sets the data on a completed test
			_id: Session.get('score-id'),
			answers: res.responses,
			percentage: res.percentage,
			total: res.total,
			numCorrect: res.numCorrect,
			createdAt: Date.now()
		};

		Meteor.call('updateScore', options, function(err, response) { //updates the score of the test
			if(err)
				return error(err);

			Session.keys = {}; /* if student-id key remains defined, assessment can be retaken */

			Router.go('/');

			success('Assessment submitted.');

			// BlazeLayout.render('app', {content: 'results', percentage: res.percentage, numCorrect: res.numCorrect, length: length});
		});
	},

	'change input' (e) { //when the input for something is changed, it updates the score

		var res = processResponses(false);

		console.log(Session.get('score-id'));

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

function cheating() { //calls cheating-- checks for cheating
    Meteor.call('cheating', Session.get('score-id'), true);
}

function doneCheating() { //once a student comes back to the page, this is shown
	error('Do not leave the page or your test will be voided');
	Meteor.call('cheating', Session.get('score-id'), false);
}

function processResponses(mustBeCompleted) { //once a test is completed, it's responses are recorded and it is graded
	
	var responses = '',
		percentage = numCorrect = total = 0;

	for (var i = 1; i < length + 1; i++)
		responses += $('input[name="q' + i + '"]:checked').val();

	// if (responses.includes('undefined') && mustBeCompleted)
	// 	return false;

	responses = responses.replace(/undefined/g, 'F'); /* F signifies a blank response */
	responses = responses.split('');

	for (var i = 0; i < length; i++) {
		total++;
		if (responses[i] === test.answers[i]) numCorrect++;
	}

	percentage = Math.round(numCorrect / total * 100); //calculates percentage grade

	return {percentage: percentage, responses: responses, numCorrect: numCorrect};
}