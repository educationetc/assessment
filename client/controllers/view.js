import { Scores } from '../../mongo/scores.js';
import { Tests } from '../../mongo/tests.js';

Router.route('/:testId/view', {

	subscriptions: function () {
		return [Meteor.subscribe('tests'), Meteor.subscribe('scores', this.params.testId)]; //looks at the scores of a specific test
	},

	action: function () {
		if (this.ready()) { //looks at all the tests taken of a specific test
			var test = Tests.findOne({_id: this.params.testId});

			if (!Meteor.user() || !test || test.admin !== Meteor.userId()) //checks that it's the right person looking at the test
				return BlazeLayout.render('app', {content: '404'});

			var scores = Scores.find({testId: this.params.testId}).fetch();

			if (scores.length === 0) //checks for tests
				error('No scores found.');

			Session.set('test', test); //renders all the taken tests
			Session.set('scores', scores);
			BlazeLayout.render('app', {content: 'view', scores: scores, test: test});

		} else {
			BlazeLayout.render('app', {content: 'spinner'});
		}
	}
});

Template.view.events({

	'click #update-sheet' (e) { //updates the google spreadsheet
		Meteor.call('updateSheet', buildCSV(), function(err, res) {
				if (err)
					return error(err.error);
	
				success('Google Spreadsheet updated!');
		});
	}
});

Template.view.helpers({
	date (date) { //gets date
		return (new Date(date)).toString().split(' ').slice(0, 4).join(' ');
	},

	isntF (s) { //checks the response isn't empty
		return s !== 'F';
	},

	color (answer, index) { //colors the answer green if correct, red if not
		return Session.get('test').answers[index] === answer ? 'green' : 'red';
	},

	buildScoreString (score) { //builds the scores based on correctness
		// var o = 0;

		// $.each(score.answers, function (index, value) {
		// 	if (value === 'F') o++;
		// });

		// return score.numCorrect + ' out of ' + (score.answers.length) + ((o > 0) ? (' (' + o + ' yet to answer)') : '');
		return score.numCorrect + ' out of ' + (score.answers.length);
	},

	buildStatusString (score) { //shows status of test - in progress, cheating, completed
		return score.createdAt === 0 ? 'In progress' : score.createdAt === -1 ? 'Potentially Cheating (Exited Assessment)' : 'Completed ' + from(score.createdAt);
	},

	getName(studentId, classroom) { //gets name of student
		return students[classroom][parseInt(studentId)];
	},

	getClassroom() { //gets what class the tests are for
		return Session.get('test').classroom;
	}
});

function buildCSV() { //builds the CSV of student id and score
	var s = '',
		sc = Session.get('scores');

	for (var i = 0; i < sc.length; i++) {
		s += (sc[i].studentId + ',' + sc[i].percentage + '\n');
	}

	return encodeURIComponent(s);
}