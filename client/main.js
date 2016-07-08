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

Template.registerHelper('add', (int) => {
	return int + 1;
})