import { Classes } from '../../mongo/class.js';
import { Students} from '../../mongo/students.js';

Router.route('/addclass', function () {
	if(!Meteor.user())
		return BlazeLayout.render('app', {error: '404'});
	Session.set('students', new Array(0));
	BlazeLayout.render('app', {content: 'addclass'});
});

Template.addclass.events({
	'click #student-submit'(e) {
		e.preventDefault();

		var lastname = $('#lastname').val();
		firstname = $('#firstname').val();
		num = $('#id').val();

		if(!lastname||!firstname||!num){
			return error('A student must have a first name, last name, and student ID.')
		}
		var options = {
			lastname: lastname,
			firstname: firstname,
			num: num
		}
		var students = Session.get('students');
		students.push(options);
		Session.set('students', students);
		$('#lastname').val('');
		$('#firstname').val('');
		$('#id').val('');
	},
	'click #delete'(e) {
		e.preventDefault();

		var students = Session.get('students');
    	index = -1;
		for(var i = 0; i < students.length; i++) {
    		if (students[i].firstname === this.firstname && students[i].lastname === this.lastname && students[i].num === this.num) {
        		index = i;
        		break;
   			 }
		}
		students.splice(index, 1);
		Session.set('students',students);
	},
	'submit #new-class'(e) {
		e.preventDefault();

		var name = $('input[name="name"]').val();
		console.log(name);
		students = Session.get('students');

		if(!name)
			return error('Please name your test.');
		if(students.length <= 0)
			return error('You must have at least one student.');

		var options = {
			name: name
		};

		Meteor.call('insertClass', options, function(err,res){
			if(err)
				return error(err);
		});

		for(var i = 0; i < students.length; i++){
			var options = {
				lastname: students[i].lastname,
				firstname: students[i].firstname,
				num: students[i].num,
				classroom: name
			};
			Meteor.call('insertStudent', options, function(err,res){
				if(err)
					return error(err);
			});
		}

		Router.go('/classes');
	}
});

Template.addclass.helpers({
	students() {
		return Session.get('students');
	}
});