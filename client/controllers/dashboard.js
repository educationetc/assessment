import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var tests;

Router.route('/dashboard', function() {
	if(!Meteor.user())
		return Router.go('/login');

	/*	find user's authored tests	*/
	tests = Tests.find({admin: Meteor.userId()}, {sort: {createdAt: -1}})

	if(tests)
		tests = tests.fetch();
	else
		tests = [];

	BlazeLayout.render('app', {content: 'dashboard', tests: tests});
})

Template.dashboard.helpers({
	tests() {
		tests.forEach(t => {
			var scores = Scores.find({token: t.token});
			if(!scores)
				return;

			scores 			= scores.fetch();
			var sum 		= 0;

			scores.forEach(s => sum += s.percentage);

			var avg 		= ~~(sum / scores.length) + '%';

			t.avg 			= avg ? avg : 0;
			t.scores 		= scores;
			t.createdAt		= (new Date(t.createdAt)).toString().split(' ').slice(0, 4).join(' ');
		})

		return tests;
	}
})