import { Meteor } from 'meteor/meteor';
import { Tests } from '../mongo/tests.js';
import { Scores } from '../mongo/scores.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('tests', function() {
    return Tests.find({});
});

// Meteor.publish('scores', function(testId) {
// 	if (!Tests.findOne(testId) || Tests.findOne(testId).admin !== this.userId)
// 		return false;

// 	return Scores.find({ testId: testId });
// });

Meteor.publish('scores', function() {
	return Scores.find({});
});