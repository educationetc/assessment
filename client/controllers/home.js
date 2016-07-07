import { Tests } from '../../mongo/tests.js';

Router.route('/', function () {
	BlazeLayout.render('app', {content: 'home'});
});

Template.home.events({
	'submit #token-form' (e) {
		e.preventDefault();

		var token = $('input[name="token"]').val(), 
			test = Tests.findOne({token: token});

		if (!test)
			return $('#error').text('Test not found');

		$('#error').text('');
		$('#success').text('Test found!');

		Session.set('token', test.token);

		$('#id').show();
		$('#token-form').attr('id', 'student-id-form');
	},

	'submit #student-id-form' (e) {
		e.preventDefault();

		$('#success').text('');

		Session.set('student-id', $('input[name="student-id"]').val());

		Router.go('/' + Session.get('token'));
	},
});