import { Scores } from '../../mongo/scores.js';
import { Tests } from '../../mongo/tests.js';

var test;

Router.route('/:testId/view', function () {

	test = Tests.findOne({_id: this.params.testId});

	if (!Meteor.user() || !test || test.admin !== Meteor.userId())
		return BlazeLayout.render('app', {content: '404'});

	var scores = Scores.find({testId: this.params.testId}).fetch();

	if (scores.length === 0)
		return BlazeLayout.render('app', {content: 'view', error: 'No scores found'});

	BlazeLayout.render('app', {content: 'view', scores: scores});
});

var omitted;

Template.view.helpers({
	date (date) {
		return (new Date(date)).toString().split(' ').slice(0, 4).join(' ');
	},

	isntF (s) {
		return s !== 'F';
	},

	color (answer, index) {
		return test.answers[index] === answer ? 'green' : 'red';
	},

	buildScoreString (score) {
		omitted = 0;

		$.each(score.answers, function (index, value) {
			if (value === 'F') omitted++;
		});

		return score.numCorrect + ' out of ' + (score.answers.length - omitted) + ((omitted > 0) ? (' (' + omitted + ' yet to answer)') : '');

	},

	isInProgress(score) {
		return omitted > 0;
	}
});