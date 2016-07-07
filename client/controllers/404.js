Router.route('*', function() {
	BlazeLayour.render('app', {error: '404'});
})