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
			return error('Please enter student id');

		var studentName = ref[parseInt(id)];

		if(!studentName)
			return error('Student id not found.');

		console.log(studentName);
		Session.set('student-name', studentName);
		Session.set('student-id', id);
		Session.set('student-name', ref[id]);

		Router.go('/' + Session.get('token') + '/t');
	},
});

function error(err) {
	$('#error').fadeIn(1000);
	$('#error-msg').text(err);

	setTimeout(() => $('#error').fadeOut(1000), 2000);
}

function checkToken(token) {

	var test = Tests.findOne({token: token});
	var input = $('#assessment-input-id');

	if (!test) {
		input.addClass('animated shake');
		input.css('border', '3px solid red');
		error('Test not found.')

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

var ref = {
	18665: 'Bailey, Devon',
	57926: 'Baye-Ellison, Zayd',
	18675: 'Carri, Anthony',
	54623: 'Dawes, Xavier',
	57716: 'Evangelist, Kara',
	18512: 'Evans, Reid',
	20074: 'Garrett, Joshua',
	52725: 'Godbold, Sean',
	11111: 'Ives, Jill',
	51436: 'Marshall, Stephanie',
	41906: 'Rosalva, Michael',
	17927: 'Senecal, Joshua'
};