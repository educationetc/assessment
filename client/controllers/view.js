import { Scores } from '../../mongo/scores.js';

Router.route('/:token/view', function () {

	var scores = Scores.find({token: this.params.token});

	if (!scores)
		BlazeLayout.render('app', {content: 'view', error: 'No scores found'})

	BlazeLayout.render('app', {content: 'view', scores: scores.fetch()});
});

Template.view.helpers({
	add(int) {
		return int + 1;
	}
})