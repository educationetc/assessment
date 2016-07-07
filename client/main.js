/*	mongo	*/
import { Tests } from '../mongo/tests.js';

/*	app template	*/
import './main.html';

/*	static pages	*/
import './views/about.html';
import './views/donate.html';
import './views/404.html';

/*	dynamic pages	*/
import './views/assessment.html';
import './controllers/assessment.js';
import './controllers/create.js';
import './controllers/edit.js';
import './views/forgot.html';
import './controllers/forgot.js';
import './views/home.html';
import './controllers/home.js';
import './controllers/404.js';
import './views/login_register.html';
import './controllers/login_register.js';
import './views/manage.html';
import './controllers/manage.js';
import './views/settings.html';
import './controllers/settings.js';
import './views/view.html';
import './controllers/view.js';

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