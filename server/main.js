// set email here!
Meteor.startup(function () {
  process.env.MAIL_URL = '';
});

var key = '1234567890ABCDEFGHJKLMNPQRSTUVWXYZ',
  students = '';

Meteor.startup(() => {
  students = JSON.parse(Assets.getText('students.json'));
});

function generateId(int) {
	var str = '';

	for(var j = 0; j < int; j++)
		str += key[Math.floor(Math.random() * key.length)];

	return str;
}

import { Email } from 'meteor/email';
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
	'getStudents': function() {
		return students;
	},

	'insertTest': function(options) {
		Tests.insert({
			token: generateId(5),
			admin: this.userId,
			name: options.name,
			answers: options.answers,
			classroom: options.classroom,
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

	'hasTaken': function(options) {
		return Scores.findOne({$and: [{testId: options.testId}, {studentId: options.studentId}]}) ? true : false;
	},

	'cheating': function(scoreId, isCheating) {
		Scores.update({
			_id: scoreId
		}, {
			$set: {
				createdAt: isCheating ? -1 : 0
			}
		});
	},

	sendEmail: function (to, from, subject, text) {
	    check([to, from, subject, text], [String]);

	    // Let other method calls from the same client start running,
	    // without waiting for the email sending to complete.
	    this.unblock();

	    Email.send({
	      to: to,
	      from: from,
	      subject: subject,
	      text: text
	    });
  	},

  	'updateSheet': function(data) {
    	//send the data to a listener script on the spreadsheet using a get request
    	HTTP.call( 'GET', 'https://script.google.com/macros/s/AKfycbxf04KlyujdhvBTOO5qW-Q6UM6nj5aX4dyth5GGt6GjeFa9I44/exec?data=' + data, {}, function(err, res) {
    	  if (err || (res.data.result || '') !== 'success')
    	    throw new Meteor.Error('Google Spreadsheet could not be updated.');
    });
  }
});