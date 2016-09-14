import { Scores } from '../../mongo/scores.js';
import { Tests } from '../../mongo/tests.js';


Router.route('/:testId/view', {

	subscriptions: function () {
		return [Meteor.subscribe('tests'), Meteor.subscribe('scores', this.params.testId)];
	},

	action: function () {
		if (this.ready()) {
			var test = Tests.findOne({_id: this.params.testId});

			if (!Meteor.user() || !test || test.admin !== Meteor.userId())
				return BlazeLayout.render('app', {content: '404'});

			var scores = Scores.find({testId: this.params.testId}).fetch();

			if (scores.length === 0)
				error('No scores found.');

			Session.set('test', test);
			Session.set('scores', scores);
			BlazeLayout.render('app', {content: 'view', scores: scores, test: test});

		} else {
			BlazeLayout.render('app', {content: 'spinner'});
		}
	}
});

Template.view.events({

	'click #update-sheet' (e) {
		console.log('click');
		Meteor.call('updateSheet', buildCSV(), function(err, res) {
				if (err)
					return error(err.error);
	
				success('Google Spreadsheet updated!');
		});
	}
});

Template.view.helpers({
	date (date) {
		return (new Date(date)).toString().split(' ').slice(0, 4).join(' ');
	},

	isntF (s) {
		return s !== 'F';
	},

	color (answer, index) {
		return test.answers[index] === answer ? 'green' : 'red';
	},

	buildScoreString (score) {
		// var o = 0;

		// $.each(score.answers, function (index, value) {
		// 	if (value === 'F') o++;
		// });

		// return score.numCorrect + ' out of ' + (score.answers.length) + ((o > 0) ? (' (' + o + ' yet to answer)') : '');
		return score.numCorrect + ' out of ' + (score.answers.length);
	},

	buildStatusString (score) {
		return score.createdAt === 0 ? 'In progress' : score.createdAt === -1 ? 'Potentially Cheating (Exited Assessment)' : 'Completed ' + from(score.createdAt);
	},

	getName(studentId, classroom) {
		return classrooms[classroom][studentId];
	},

	getClassroom() {
		return Session.get('test').classroom;
	}
});

var classrooms = {
	'Algebra 1': {
		27804:	'Armstrong, Julien Alduron Dylan',
		23627:	'Bethea, Zion Lemar',
		23224:	'Cohen, Milton Sarkis',
		24364:	'Dao, Lan Thi Xuan',
		57744:	'Davis, Janine Maleah',
		24984:	'Egeonu, Charles Uchenna',
		23125:	'Falconer, Daniel Albert',
		24085:	'Glass, Jessica Lynn',
		23209:	'Hankey, Emma Lucia',
		37424:	'Matos-Bowles, Sabreen Nicholle',
		37624:	'Mosely, Erin Elizabeth',
		24867:	'Nelson, Allysa Nicole',
		26484:	'Oniyama, Jonathan',
		55640:	'Paul, Evan',
		21225:	'Seltzer, Nadia Marina',
		53474:	'Torrente, Jacinto',
		56850:	'White, Nyla Serene',
		24927:	'Williams, Terrel Allister',
		23745:	'Wilner, Emily Grace',
		23686:	'Bryant II, Jeffrey Leigh',
		52749:	'Castro Cortez, Jairo Alberto',
		22504:	'Koenig, Michelle Aviva',
		23424:	'Kopelan, Nathaniel Reece',
		37384:	'Pierre-Paul, Jethro',
		22726:	'Sinclair, Drew Charles'
	},

	'Precalc CS': {
		54150:	'Berlin, Alisa Tzivya',
		20543:	'Botschka, Abigail Mary',
		19511:	'Brown, Emily Jeannette',
		19761:	'Cadet, Stephanie Luce',
		19352:	'Depue, Madeline Faith',
		53565:	'Destine, Julie Ann',
		19384:	'DuBowy, Adam',
		20391:	'Dybner, Phoebe',
		19465:	'Gonon, Jessie Claire',
		19413:	'Gordon, Seth Alexander',
		19433:	'Hart-Ruderman, Caleb, Louis',
		20759:	'Herbert, Came,ron Gene',
		20649:	'Kalderen, Lilly-Anne Lydia Eva',
		16842:	'Lowenthal, Ian Cairns',
		26126:	'Lupton, Alejandra Michele',
		19840:	'McCrear, Sierra Renee',
		19564:	'Reilly, Madeleine Ruth',
		37584:	'Renda, Oscar Salvatore',
		51430:	'Rocha, Paula Olivia',
		20753:	'Sartori, Ryan Fausto',
	},

	'P6 Calc BC': {
		19313:	'Anthony, Joshua Sessler',
		50526:	'Antoine, Eloise Marie',
		51627:	'Ashcraft, Jhamani Anise',
		19427:	'Cerny, Caroline Helene',
		19555:	'Cox, Hanna Xia-Lan',
		18516:	'Cummins, Carson Irene',
		19477:	'Donald, Cameron Matthew',
		19088:	'Dunston, Jeremy Jessani',
		18336:	'Fox, Carolyn Gabrielle',
		19236:	'Friedman-Brown, Adam Thomas',
		18776:	'Garrison, Hanae Eda',
		27224:	'George, Jarred Matthew',
		19325:	'Gillette, Dean Joseph',
		16140:	'Herrera, Benjamin Aaron',
		18530:	'Joyce, Veronica Emerich',
		18413:	'LaCon, Jeremiah Christian',
		18432:	'Lieber, Avery Dennis',
		21565:	'Ostrow, Nicole Chan',
		19454:	'Renshaw, Duncan Christopher',
		19420:	'Rothstein, Benjamin Jon',
		19399:	'Schwartzbard, Nicole Catherine',
		19348:	'Torrey, Anna',
		19254:	'Trewick, Valerie Alres',
		19699:	'Viqueira, Marissa Sophia',
		19342:	'Wendt, Isabelle Victoria'
	},

	'AP CSP': {
		18534:	'Ash-Milby, Nathan Chee',
		18245:	'Baker, James Leonard',
		18876:	'Benskins, Jared Hillel Goodma',
		18535:	'Brantley, Van Wells',
		19376:	'Bryant, Halle Clemence',
		18714:	'Dodd, Christopher Matthew',
		18517:	'Finnamore, Emma Viktoria',
		19713:	'Forman, Sam Alex',
		18419:	'Fox, Sophie Lara',
		18464:	'Frey, Connor Walton',
		27224:	'George, Jarred Matthew',
		15856:	'Harrigan, John Laramee',
		18317:	'Hill, David Mason Malaney',
		18413:	'LaCon, Jeremiah Christian',
		18229:	'Makhdoom, Asma Abdul',
		18261:	'Nadler, Coltrane Barnett',
		18278:	'Orgera, Benjamin Sender',
		21565:	'Ostrow, Nicole Chan',
		18796:	'Pangallozzi, Jared Anthony',
		18331:	'Peterson, Lucas Joseph',
		18484:	'Pham, Camille Vien',
		18448:	'Romanoff, Devin Michael',
		18428:	'Sherbine, Michael William',
		19718:	'Vyakarnam, Anshul Narsimha',
		19855:	'Ward, Elizabeth Emily Catheri',
		18469:	'Weiss, Luisa Christina',
		19608:	'Wood, Jeremy Kwestel'
	}
}

function buildCSV() {
	console.log('building');
	var s = '',
		sc = Session.get('scores');

	console.log(sc);
	for (var i = 0; i < sc.length; i++) {
		console.log(sc[i]);
		s += (sc[i].studentId + ',' + sc[i].percentage + '\n');
	}

	console.log(s);
	return encodeURIComponent(s);
}