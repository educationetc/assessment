import { Classes } from '../../mongo/class.js';
import { Students } from '../../mongo/students.js'

var classes;

Router.route('/classes', function () {
	if(!Meteor.user())
		return BlazeLayout.render('app', {error: '404'});

	Meteor.call('getOwnedClasses', function(err, res) {
		if (err)
			return error(err);

		classes = res;

		var j = 0;

		populate();

		function populate() {
			if(j === classes.length) 
				return BlazeLayout.render('app', {content: 'classes', classes: classes});

			Meteor.call('getStudents', classes[j]._id, function(err, res) {
				if (!res) {
					j++;
					return populate();
				}

				classes[j].students = res;

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