/*	mongo	*/
import { Tests } from '../mongo/tests.js';

/*	app template	*/
import './main.html';

/*	static pages	*/
import '../views/about.html';
import '../views/donate.html';

/*	dynamic pages	*/
import '../views/assessment.html';
import '../controllers/assessment.js';
import '../views/forgot.html';
import '../controllers/forgot.js';
import '../views/home.html';
import '../controllers/home.js';
import '../views/login_register.html';
import '../controllers/login_register.js';
import '../views/manage.html';
import '../controllers/manage.js';
import '../views/settings.html';
import '../controllers/settings.js';
import '../views/view.html';
import '../controllers/view.js';