import { Tests } from '../../mongo/tests.js';

Router.route('/', function () {
	Meteor.subscribe('tests'); /* don't wait for the subscription because hopefully it will have loaded by the time they click, no need for a spinner */
	BlazeLayout.render('app', {content: 'home'});
});

Template.home.events({
	'submit #token-form' (e) {
		e.preventDefault();
		checkToken($('input[name="token"]').val());
	},

	'submit #student-id-form' (e) {
		e.preventDefault();

		var id = $('input[name="student-id"]').val();

		if (!id)
			return error('Please enter student id');

		var studentName = students[Session.get('classroom')][parseInt(id)];

		if(!studentName || !students[Session.get('classroom')])
				return error('You are not in this class...');

		Meteor.call('hasTaken', {studentId: id, testId: Session.get('testId')}, function(err, res) {
			if(err)
				return error(err);

			if(res)
				return error('You cannot take the same test more than once!');

			Session.set('student-name', studentName);
			Session.set('student-id', id);

			Router.go('/' + Session.get('token') + '/t');
		})
	},

	'click #powerschool-btn' (e) {
		Meteor.call('sendEmail',
            'coltranenadler@gmail.com',
            'coltranenadler@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');
	}
});

function checkToken(token) {

	Meteor.call('getTest', token, function(err, res) {
		
		if (err)
			return error(err);

		var input = $('#assessment-input-id');

		if (!res) {
			input.addClass('animated shake');
			input.css('border', '3px solid red');
			error('Test not found.');
	
			setTimeout(() => {
				input.css('border', '3px solid #e6e6e6');
				input.removeClass('animated shake')
			}, 1000);
	
			return;
		}

		console.log(res);
		Session.set('classroom', res.classroom);
		success('Test found.');
		Session.set('token', token);
		Session.set('testId', res._id);
	
		input.prop('disabled', true);
		input.css('border', '3px solid #66ff99');
		input.css('background-color', '#d9d9d9')
	
		$('#id').show();
		$('#token-form').attr('id', 'student-id-form');
	});
	
}
