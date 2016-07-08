import { Tests } from '../../mongo/tests.js';

var key = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateId(int) {
	var str = '';

	for(var j = 0; j < int; j++)
		str += key[Math.floor(Math.random() * key.length)];

	return str;
}

/*	create route	*/
Router.route('/create', function() {
	if(!Meteor.user())
		return BlazeLayout.render('app', {error: '404'});

	BlazeLayout.render('app', {content: 'create'});
})

Template.create.events({
	'click #add-question'(e) {
		e.preventDefault();

		Session.set('questions', Session.get('questions').push({}));
	},

	'submit #new-assessment'(e) {
		e.preventDefault();

		var answers = '',
			length = $('.form-group').length;

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val();

		console.log(length);

		if (answers.includes('undefined'))
			return $('#error').text('Please fill out entire assessment');

		$('#error').text('');

		Test.insert({
			token: generateId(5),
			// admin: Meteor.userId(),
			answers: answers.split(''),
			createdAt: Date.now()
		});


		// BlazeLayout.render('app', {content: 'results'})
	}
})

Template.create.helpers({
	questions() {
		return Session.get('questions');
	}
})