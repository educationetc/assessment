import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var tests;

Router.route('/dashboard', function() {
	BlazeLayout.render('app', {content: 'spinner'});

	if(!Meteor.user())
		return BlazeLayout.render('app', {content: '404'});

	Meteor.call('getOwnedTests', function(err, res) {


		if (err)
			return error(err);

		tests = res;

		var j = 0;

		populate();

		function populate() {
			if(j === tests.length) 
				return BlazeLayout.render('app', {content: 'dashboard', tests: tests});

			Meteor.call('getScores', tests[j]._id, function(err, res) {
				if (!res) {
					j++;
					return populate();
				}

				var sum = 0;

				res.forEach(s => sum += s.percentage);

				var avg = ~~(sum / res.length) + '%';

				tests[j].avg = avg ? avg : 0;
				tests[j].scores = res;

				j++;
				populate();
			});
			
		}
	});
});

Template.dashboard.helpers({
	add(int) {
		return int + 1;
	}
});