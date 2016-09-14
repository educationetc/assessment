import { Tests } from '../../mongo/tests.js';

/*	create route	*/
Router.route('/create', function () {
	if(!Meteor.user())
		return BlazeLayout.render('app', {error: '404'});

	Session.set('questions', new Array(5));
	BlazeLayout.render('app', {content: 'create'});
});


Meteor.startup(function () {
if (Meteor.user()) {
  $(document).on('keyup', function (e) {
   	switch (e.which) {
		case 65:
			bubbleNext('A');
			break;
		case 66:
			bubbleNext('B');
			break;
		case 67:
			bubbleNext('C');
			break;
		case 68:
			bubbleNext('D');
			break;
		case 69:
			bubbleNext('E');
			break;
		default:
			return;
	}
  });
}
});

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
			name 		= $('input[name="name"]').val(),
			classroom	= $('#classroom').val()

		if(!name)
			return error('Please name your test.');

		for (var i = 1; i < length + 1; i++)
			answers += $('input[name="q' + i + '"]:checked').val() ? $('input[name="q' + i + '"]:checked').val() : 'O';

		if (answers.includes('undefined'))
			return error('Please fill out entire assessment');

		var options = {
			name: name,
			answers: answers.split(''),
			classroom: classroom
		}

		Meteor.call('insertTest', options, function(err, res) {
			if(err)
				return error(err);

			Router.go('/dashboard');
		});
	}
});

Template.create.helpers({
	questions() {
		return Session.get('questions');
	}
});

function bubbleNext(answer) {
	for (var i = 1; i < Session.get('questions').length + 1; i++)
		if (!$('input[name="q' + i + '"]:checked').val())
			return $('input[id="' + answer + i + '"]').prop('checked', true);


	var questions = Session.get('questions');
	questions.push(null);
	Session.set('questions', questions);

	setTimeout(function () { $('input[id="' + answer + Session.get('questions').length + '"]').prop('checked', true) }, 0);
}
