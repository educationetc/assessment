import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var tests;

Router.route('/dashboard', function() {

	if(!Meteor.user())
		return BlazeLayout.render('app', {content: '404'});

	/*	find user's authored tests	*/
	tests = Tests.find({admin: Meteor.userId()}, {sort: {createdAt: -1}})

	tests = tests ? tests.fetch() : [];

	BlazeLayout.render('app', {content: 'dashboard', tests: tests});
})

Template.dashboard.helpers({
	tests() {
		tests.forEach(t => {
			var scores = Scores.find({testId: t._id});
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
	},

	add(int) {
		return int + 1;
	} 
})