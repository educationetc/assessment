// set email here!
Meteor.startup(function () {
  process.env.MAIL_URL = '';
});

var key = '1234567890ABCDEFGHJKLMNPQRSTUVWXYZ', //string from which the key string is created
  students = '';

Meteor.startup(() => {
  students = JSON.parse(Assets.getText('students.json')); //parses through students.json and adds all the elements to students
});

function generateId(int) { //generates ID by selecting int random characters from key
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

Meteor.publish('tests', function() { //finds all of the tests for that particular admin ID
    return Tests.find({admin: this.userId});
});

Meteor.publish('scores', function(testId) { //find the scores for a given test ID

	var test = Tests.findOne({_id: testId});

	if (!test || test.admin !== this.userId)
		return false;

	return Scores.find({testId: testId});
});

Meteor.methods({
	'getStudents': function() { //returns the array of students
		return students;
	},

	'insertTest': function(options) { //creates a new test
		Tests.insert({
			token: generateId(5),
			admin: this.userId,
			name: options.name,
			answers: options.answers,
			classroom: options.classroom,
			createdAt: Date.now()
		});
	},

	'editTest': function(options) { //updates an edited test
		Tests.update({
			_id: options.testId
		}, {
			$set: {
				name: options.name,
				answers: options.answers
			}
		})
	},

	'getTest': function(token) { //find the test with the matching token
		return Tests.findOne({token: token});
	},

	'insertScore': function(options) { //grades the test

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

	'updateScore': function(options) { //updates the grade of the test

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

	'getScores': function(testId) { //find all the scores for a specific test
		return Scores.find({testId: testId}).fetch();
	},

	'getOwnedTests': function() { //find all the scores for a specific teacher
		return Tests.find({admin: this.userId}, {sort: {createdAt: -1}}).fetch();
	},

	'hasTaken': function(options) { //sees whether a specific student has taken a specific test
		return Scores.findOne({$and: [{testId: options.testId}, {studentId: options.studentId}]}) ? true : false;
	},

	'cheating': function(scoreId, isCheating) { //looks at whether a student may have exited the webpage, and sets itself accordingly
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