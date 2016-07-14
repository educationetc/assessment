import { Scores } from '../../mongo/scores.js';
import { Tests } from '../../mongo/tests.js';

var test;

Router.route('/:testId/view', {

	subscriptions: function () {
		return [Meteor.subscribe('tests'), Meteor.subscribe('scores', this.params.testId)];
	},

	action: function () {
		if (this.ready()) {
			test = Tests.findOne({_id: this.params.testId});

			if (!Meteor.user() || !test || test.admin !== Meteor.userId())
				return BlazeLayout.render('app', {content: '404'});

			var scores = Scores.find({testId: this.params.testId}).fetch();

			if (scores.length === 0)
				error('No scores found.');

			BlazeLayout.render('app', {content: 'view', scores: scores, test: test});

		} else {
			BlazeLayout.render('app', {content: 'spinner'});
		}
	}
});

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
		var o = 0;

		$.each(score.answers, function (index, value) {
			if (value === 'F') o++;
		});

		return score.numCorrect + ' out of ' + (score.answers.length - o) + ((o > 0) ? (' (' + o + ' yet to answer)') : '');
	},

	buildStatusString (score) {
		return score.createdAt === 0 ? 'In progress' : score.createdAt === -1 ? 'Potentially Cheating (Exited Assessment)' : 'Completed ' + from(score.createdAt);
	}
});