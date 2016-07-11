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

		Router.go('/' + Session.get('token') + '/t');
	},
});

function checkToken(token) {

	var test = Tests.findOne({token: token});

	if (!test)
		return $('#error').text('Test not found');

	Session.set('token', test.token);

	$('#error').text('');
	$('#success').text('Test found!');

	$('#id').show();
	$('#token-form').attr('id', 'student-id-form');
}