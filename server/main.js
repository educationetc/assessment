var key = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateId(int) {
	var str = '';

	for(var j = 0; j < int; j++)
		str += key[Math.floor(Math.random() * key.length)];

	return str;
}

import { Meteor } from 'meteor/meteor';
import { Tests } from '../mongo/tests.js';
import { Scores } from '../mongo/scores.js';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('tests', function() {
    return Tests.find({admin: this.userId});
});

Meteor.publish('scores', function(testId) {

	var test = Tests.findOne({_id: testId});

	if (!test || test.admin !== this.userId)
		return false;

	return Scores.find({testId: testId});
});

Meteor.methods({
	'insertTest': function(options) {
		Tests.insert({
			token: generateId(6),
			admin: this.userId,
			name: options.name,
			answers: options.answers,
			createdAt: Date.now()
		});
	},

	'editTest': function(options) {
		Tests.update({
			_id: options.testId
		}, {
			$set: {
				name: options.name,
				answers: options.answers
			}
		})
	},

	'getTest': function(token) {
		return Tests.findOne({token: token});
	},

	'insertScore': function(options) {

		return Scores.insert({
			testId: options.testId,
			studentName: options.studentName,
			studentId: options.studentId,
			answers: options.answers,
			percentage: 0,
			numCorrect: 0,
			createdAt: 0
		});
	},

	'updateScore': function(options) {

		Scores.update({
			_id: options._id
		}, {
			$set: {
				answers: options.answers,
				percentage: options.percentage,
				total: options.total,
				numCorrect: options.numCorrect,
				createdAt: (options.createdAt || 0)
			}
		});
	},

	'getScores': function(testId) {
		return Scores.find({testId: testId}).fetch();
	},

	'getOwnedTests': function() {
		return Tests.find({admin: this.userId}, {sort: {createdAt: -1}}).fetch();
	},

	'cheating': function(scoreId, isCheating) {
		Scores.update({
			_id: scoreId
		}, {
			$set: {
				createdAt: isCheating ? -1 : 0
			}
		});
	}
});