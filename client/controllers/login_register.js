import { Accounts } from 'meteor/accounts-base';

Router.route('/login', function() {
	BlazeLayout.render('app', {content: 'login'});
})

Router.route('/register', function() {
	BlazeLayout.render('app', {content: 'register'});
})

Template.login.events({
	'submit #login-form'(e) {
		e.preventDefault();

		var username 		= $('input[name="username"]').val(),
			password		= $('input[name="password"]').val();

		Meteor.loginWithPassword(username, password, function(err) {
			if(err)
				return $('#error').text(err);

			Router.go('/dashboard');
		});
	}
})

Template.register.events({
	'submit #register-form'(e) {
		e.preventDefault();

		var username 		= $('input[name="username"]').val(),
			firstName 		= $('input[name="first-name]').val(),
			lastName		= $('input[name="last-name]').val(),
			password		= $('input[name="password"]').val(),
			confirmPassword	= $('input[name="confirm-password"]').val();

		if(password !== confirmPassword)
			return $('#error').text('Passwords do not match.')

		var options = {
			username: username,
			password: password,
			profile: {
				firstName: firstName,
				lastName: lastName
			}
		}

		Accounts.createUser(options, function(err) {
			if(err)
				return $('#error').text(err);

			Router.go('/dashboard');
		});
	}
})