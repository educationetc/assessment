import { Tests } from '../../mongo/tests.js';
import { Scores } from '../../mongo/scores.js';

var tests;

Router.route('/dashboard', function() {
	BlazeLayout.render('app', {content: 'spinner'}); //spinner isn't currently used

	if(!Meteor.user())
		return BlazeLayout.render('app', {content: '404'}); //if not admin, a 404 page

	Meteor.call('getOwnedTests', function(err, res) { //gets all tests that belong to that teacher


		if (err)
			return error(err);

		tests = res;

		var j = 0;

		populate();

		function populate() { //a recursive routine that populates the dashboard with student tests
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
	add(int) { //adds
		return int + 1;
	}
});