/*	mongo	*/
import { Tests } from '../mongo/tests.js';
import { Scores } from '../mongo/scores.js';
/*
------------ schemas ------------
Tests
{
	token: String,
	answers: Array,
	createdAt: Number,
	admin: String
}

Scores
{
	studentId: String,
	token: String,
	answers: Array,
	createdAt: Number
}

Users
{
	_id: String,
	username: String
}
------------ /schemas -----------
*/

Router.route('/about', function() {
	BlazeLayout.render('app', {content: 'about'});
});

Template.registerHelper('add', (int) => int + 1)
Template.registerHelper('session', (key) => Session.get(key));
Template.registerHelper('from', (time) => {
	if(time === 0)
		return 'Currently in progress'

	var t = Date.now() - time
		, s = t / 1000
		, str = '';

	if(s / 86400 > 1)
		str = (~~(s/86400)) + ' days ago'
	else if(s / 3600 > 1)
		str = (~~(s / 3600)) + ' hours ago'
	else if((s / 60) > 1)
		str = (~~(s / 60)) + ' minutes ago'
	else
		str = s + ' seconds ago'

	return str;
});

error = function(msg) {
	$('#error').fadeIn(1000);
	$('#error').text(msg);

	setTimeout(() => $('#error').fadeOut(1000), 2000);
}

success = function(msg) {
	$('#success').fadeIn(1000);
	$('#success').text(msg);

	setTimeout(() => $('#success').fadeOut(1000), 2000);
}

var errorImages = [
	'http://crajun.com/wp-content/uploads/2014/10/morpheus_meme.jpg',
	'http://s.quickmeme.com/img/a8/a8022006b463b5ed9be5a62f1bdbac43b4f3dbd5c6b3bb44707fe5f5e26635b0.jpg',
	'http://s2.quickmeme.com/img/65/651187f0b2c21175af34ba007af0653f3e613e1e2b369ccfbf23091fe2ae6eea.jpg'
]