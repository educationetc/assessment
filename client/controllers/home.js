import { Tests } from '../../mongo/tests.js';

Router.route('/', function () {
	BlazeLayout.render('app', {content: 'home'});
});

Template.home.events({
	'submit #token-form' (e) {
		e.preventDefault();
		checkToken($('input[name="token"]').val());
	},

	'submit #student-id-form' (e) {
		e.preventDefault();

		$('#success').text('');
		$('#error').text('');

		var id = $('input[name="student-id"]').val();

		if (!id)
			return $('#error').text('Please enter student id')

		Session.set('student-id', id);

		Router.go('/t/' + Session.get('token'));
	},
});

function checkToken(token) {

	var test = Tests.findOne({token: token});

	if (!test)
		return $('#error').text('Test not found');

	$('#error').text('');
	$('#success').text('Test found!');

	Session.set('token', test.token);

	$('#id').show();
	$('#token-form').attr('id', 'student-id-form');
}