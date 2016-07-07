Router.route('/', function () {
	BlazeLayout.render('app', {content: 'home'});
});

Template.home.events({
	'submit #token-form' (e) {
		e.preventDefault();

		//query db using token
			//if its valid, ask for student id then start quiz
		$('#id').show();

		$('#token-form').attr('id', 'student-id-form');
	},

	'submit #student-id-form' (e) {
		e.preventDefault();

		BlazeLayout.render('app', {content: 'assessment'});
	},
});