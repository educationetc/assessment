import { Tests } from '../api/tests.js';
import { Scores } from '../api/scores.js';

// #cute <3
var key = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateId(int) {
	var str = '';

	for(var j = 0; j < int; j++)
		str += key[Math.floor(Math.random() * key.length)];

	return str;
}


/*
* ===============================
*  Assessment Routing c:
* ===============================
*/

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("app", {content: "home"});
  }
});

// create exam page
FlowRouter.route('/create', {
  action: function() {
    BlazeLayout.render("app", {content: "create"});
  }
});

// take exam page
FlowRouter.route('/assessment/:token/:admin', {
	action: function(params, queryParams) {
		var test = Tests.find({token: params.token}).fetch();

		if(test[0] === undefined)
			return BlazeLayout.render('app', {content: '404'});

		// if admin page
		if(params.admin && test[0].admin === params.admin) {
			var scores  = Scores.find({assessment: test[0].token}, {sort: {createdAt: -1}}).fetch()
				, sum 	= 0;

			Scores.forEach(s => sum += s.score);

			var mean = sum / scores.length;

			Session.set('scores.list', scores);
			Session.set('scores.total', scores.length);
			Session.set('scores.mean', mean);
			return BlazeLayout.render('app', {content: 'admin'});
		}

		// take test
		Session.set('assessment', test[0]);
		BlazeLayout.render("app", {content: "take"});
	}
})


/*
* ===============================
*  Events
* ===============================
*/

Template.home.events({
	'submit #take-assessment'(e) {
		e.preventDefault();

		var token		= $('input[name="assessment"]').val();

		window.location = '/assessment/' + token;
	}
})


// create test form
Template.create.events({
	'submit #new-assessment'(e) {
		e.preventDefault();

		var form 		= $('#new-assessment');
		var elems 		= [];
		var children 	= form.children();

		// length of children, minus the submit element
		for(var j = 0; j < children.length - 1; j++)
			for(var i = 0; i < $(children[j]).children().length; i++)
				if($(children[j]).children()[i].checked)
					elems.push($($(children[j]).children()[i]).val());

		// not enough questions!!!! WHAT R U DOING!?!
		if(elems.length < 5)
			return;

		// genereate exam and admin token
		var token = generateId(8)
			, admin = generateId(8);

		// create new test in mongo
		Tests.insert({
			token: token,
			admin: admin,
			answers: elems,
			createdAt: Date.now()
		});

		Session.set('token', token);
		Session.set('admin_token', admin);

		// redirect #success <3
		BlazeLayout.render('app', {content: 'create_success'});
	}
});

// submit test form
Template.take.events({
	'submit #assessment'(e) {
		e.preventDefault();

		var form 		= $('#assessment');
		var elems 		= [];
		var children 	= form.children();

		// length of children, minus the submit element
		for(var j = 0; j < children.length - 1; j++)
			for(var i = 0; i < $(children[j]).children().length; i++)
				if($(children[j]).children()[i].checked)
					elems.push($($(children[j]).children()[i]).val());

		// not enough questions!!!! WHAT R U DOING!?!
		if(elems.length < 5)
			return;

		// get answer key
		var assessment  = Session.get('assessment');
		var key 		= assessment.answers;
		var score 		= 0;

		// match key against submitted answers
		for(var j = 0; j < elems.length; j++)
			if(elems[j] === key[j])
				score++;

		Scores.insert({
			assessment: assessment.token,
			score: score,
			createdAt: Date.now()
		})

		Session.set('score', Math.round(score / 5 * 100));
		// redirect to score c:
		BlazeLayout.render('app', {content: 'score'});
	}
});


/*
* ===============================
*  Helpers
* ===============================
*/

// global
Template.registerHelper('session',function(input){
	var i = Session.get(input);
	console.log('Got session: ' + i);
	return Session.get(input);
}); 

Template.take.helpers({
	load(token) {
		return Tests.findOne({token: token});
	}
});