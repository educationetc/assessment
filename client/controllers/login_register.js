import { Accounts } from 'meteor/accounts-base';

Router.route('/login', function() { //takes you to login page
	if(Meteor.user())
		return Router.go('/dashboard');

	BlazeLayout.render('app', {content: 'login'});
});

Router.route('/register', function() { //takes you to register page
	if(Meteor.user())
		return Router.go('/dashboard');

	BlazeLayout.render('app', {content: 'register'});
});

Router.route('/logout', function() { //logs out and goes to home page
	Meteor.logout();
	
	success('Logged out successfully.')
	Router.go('/');
});

Template.login.events({
	'submit #login-form'(e) { //checks the login and, if legit, logs in
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
	'submit #register-form'(e) { //allows a teacher to register and creates an account for them
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
