import { Scores } from '../../mongo/scores.js';
import { Tests } from '../../mongo/tests.js';

Router.route('/:token/view', function () {

	var test = Tests.findOne({token: this.params.token});

	if (!Meteor.user() || !test || test.admin !== Meteor.userId())
		return BlazeLayout.render('app', {content: '404'});


	var scores = Scores.find({token: this.params.token}).fetch();

	if (scores.length === 0)
		return BlazeLayout.render('app', {content: 'view', error: 'No scores found'});

	BlazeLayout.render('app', {content: 'view', scores: scores});
});

Template.view.helpers({
	date (date) {
		return (new Date(date)).toString().split(' ').slice(0, 4).join(' ');
	}
})