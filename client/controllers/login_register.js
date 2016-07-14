import { Accounts } from 'meteor/accounts-base';

Router.route('/login', function() {
	if(Meteor.user())
		return Router.go('/dashboard');

	BlazeLayout.render('app', {content: 'login'});
});

Router.route('/register', function() {
	if(Meteor.user())
		return Router.go('/dashboard');

	BlazeLayout.render('app', {content: 'register'});
});

Router.route('/logout', function() {
	Meteor.logout();
	
	success('Logged out successfully.')
	Router.go('/');
});

Template.login.events({
	'submit #login-form'(e) {
		e.preventDefault();

		var email	 		= $('input[name="email"]').val(),
			password		= $('input[name="password"]').val();

		Meteor.loginWithPassword(email, password, function(err) {
			if(err)
				return error(err);

			success('Logged in successfully.');
			Router.go('/dashboard');
		});
	}
});

Template.register.events({
	'submit #register-form'(e) {
		e.preventDefault();

		var email 			= $('input[name="email"]').val(),
			firstName 		= $('input[name="first-name]').val(),
			lastName		= $('input[name="last-name]').val(),
			password		= $('input[name="password"]').val(),
			confirmPassword	= $('input[name="confirm-password"]').val();

		if(password !== confirmPassword)
			return error('Passwords do not match.')

		var options = {
			email: email,
			password: password,
			profile: {
				firstName: firstName,
				lastName: lastName
			}
		}

		Accounts.createUser(options, function(err) {
			if(err)
				return error(err);

			success('Registed successfully.')
			Router.go('/dashboard');
		});
	}
});
