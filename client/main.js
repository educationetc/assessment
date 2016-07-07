import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Quizzes } from '../api/quizzes.js';
import './main.html';

Template.admin.helpers({
  quizzes() {
    return Quizzes.find( { student_id: { $nin: ['teacher'] } } , { sort: { createdAt: 1 } });
  },
});

Template.body.helpers({
	top: function () {
		return Quizzes.findOne() ? 'student_top' : 'teacher_top';
	},
});

Template.quiz.events({
	'click button' (event, instance) {

		var answers = '', percentage = 0, correct = Quizzes.findOne();

		for (var i = 1; i < 6; i++) answers += $('input[name="' + i + '"]:checked').val();

		if (answers.includes('undefined') || (!$('input[name="student_id"]').val() && correct)) {
			alert('Please fill in all fields before submitting');
			return;
		}

		if (correct) for (var i = 0; i < 5; i++) if (correct.answers.split('')[i] === answers.split('')[i]) percentage += 20;

		Quizzes.insert({
			answers,
			percentage: (correct ? percentage : 100),
			student_id: (correct ? $('input[name="student_id"]').val() : 'teacher'),
			createdAt: new Date(),
		});

		alert((correct ? 'Created ' : 'Submitted ') + 'assessment successfully!'); 

		Router.go('/' + Quizzes.findOne()._id);

	},
});

Router.route('/', function() {
    this.render('quiz');
});

Router.route('/:key', function () {
    this.render(Quizzes.findOne() ? (this.params.key === Quizzes.findOne()._id ? 'admin' : 'quiz') : 'quiz');
});

Template.quiz.helpers({
	button_string: function() {
		return Quizzes.findOne() ? 'Submit Assessment' : 'Create Assessment';
	}
});