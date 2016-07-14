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

	Session.set('questions', new Array(5));
	BlazeLayout.render('app', {content: 'create'});
})

Template.create.events({
	'click #add-question'(e) {
		e.preventDefault();

		var questions = Session.get('questions');
		questions.push(null);

		Session.set('questions', questions);
	},

	'click #remove-question'(e) {
		e.preventDefault();

		var questions = Session.get('questions');

		// make sure they cant have 
		if(questions.length === 1)
			return error('You cannot have 0 questions!');

		questions.pop();

		Session.set('questions', questions);
	},

	'submit #new-assessment' (e) {
		e.preventDefault();

		var answers 	= '',
			length 		= $('.form-group').length - 1,
			name 		= $('input[name="name"]').val();

		if(!name)
			return $('#error').text('Please name your test.');

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val();

		if (answers.includes('undefined'))
			return $('#error').text('Please fill out entire assessment');

		Tests.insert({
			token: generateId(6),
			admin: Meteor.userId(),
			name: name,
			answers: answers.split(''),
			createdAt: Date.now()
		});

		Router.go('/dashboard');
	}
})

Template.create.helpers({
	questions() {
		return Session.get('questions');
	},

	add(int) {
		return int + 1;
	}
})