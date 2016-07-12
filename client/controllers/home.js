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
			return $('#error').text('Please enter student id');

		Session.set('student-id', id);

		console.log('lah');

		Router.go('/' + Session.get('token') + '/t');
	},
});

function checkToken(token) {

	var test = Tests.findOne({token: token});
	var input = $('#assessment-input-id');

	if (!test) {
		input.addClass('animated shake');
		input.css('border', '3px solid red');

		setTimeout(() => {
			input.css('border', '3px solid #e6e6e6');
			input.removeClass('animated shake')
		}, 1000);

		return;
	}

	Session.set('token', test.token);

	$('#error').text('');
	input.prop('disabled', true);
	input.css('border', '3px solid #66ff99');
	input.css('background-color', '#d9d9d9')

	$('#id').show();
	$('#token-form').attr('id', 'student-id-form');
}