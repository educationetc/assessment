import { Tests } from '../../mongo/tests.js';

Router.route('/', function () {
	Meteor.subscribe('tests'); /* don't wait for the subscription because hopefully it will have loaded by the time they click, no need for a spinner */
	BlazeLayout.render('app', {content: 'home'});
});

Template.home.events({
	'submit #token-form' (e) {
		e.preventDefault();
		checkToken($('input[name="token"]').val());
	},

	'submit #student-id-form' (e) {
		e.preventDefault();

		var id = $('input[name="student-id"]').val();

		if (!id)
			return error('Please enter student id');

		var studentName = classrooms[Session.get('classroom')][parseInt(id)];

		if(!studentName)
				return error('You are not in this class...');

		Meteor.call('hasTaken', {studentId: id, testId: Session.get('testId')}, function(err, res) {
			if(err)
				return error(err);

			if(res)
				return error('You cannot take the same test more than once!');

			Session.set('student-name', studentName);
			Session.set('student-id', id);

			Router.go('/' + Session.get('token') + '/t');
		})
	},

	'click #powerschool-btn' (e) {
		Meteor.call('sendEmail',
            'coltranenadler@gmail.com',
            'coltranenadler@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');
	}
});

function checkToken(token) {

	Meteor.call('getTest', token, function(err, res) {
		
		if (err)
			return error(err);

		var input = $('#assessment-input-id');

		if (!res) {
			input.addClass('animated shake');
			input.css('border', '3px solid red');
			error('Test not found.');
	
			setTimeout(() => {
				input.css('border', '3px solid #e6e6e6');
				input.removeClass('animated shake')
			}, 1000);
	
			return;
		}

		console.log(res);
		Session.set('classroom', res.classroom);
		success('Test found.');
		Session.set('token', token);
		Session.set('testId', res._id);
	
		input.prop('disabled', true);
		input.css('border', '3px solid #66ff99');
		input.css('background-color', '#d9d9d9')
	
		$('#id').show();
		$('#token-form').attr('id', 'student-id-form');
	});
	
}

var classrooms = {
	'Algebra 1': {
		59736:  'Gargyi, Reed Orion',
		59757:  'Obu, Duke-Ntitobari Enun Olumba',
		51458:  'Baluyut, Eabha Zane',
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
		19506:  'Savoia-Di Gregorio, Sage Fu Huan',
		19585:  'Stathakis, Kathryn Elisabeth',
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

	'P9 Calc BC': {
		19435: "Bell, John Leland",
		18238: "Betheil, Jamie Aliyah",
		19386: "Braka, Sarah Lily",
		19948: "Calder, Cameron Marie",
		19519: "Cotenoff, Isabelle Blu",
		19473: "Doubek, Benjamin Joseph",
		50578: "Duvergne, Lorenzo Pierre Leonid",
		18699: "Ewing, Joshua Miguel",
		19364: "Fagan, Marie Therese",
		18443: "Farruggia, Ella Pascale",
		19713: "Forman, Sam Alex",
		21104: "Glynn, Alexander Patrick",
		57400: "Grayer, Theodore Parker",
		52398: "Haile, Joshua Seyoum",
		19529: "Hajdukiewicz, Timothy James",
		20736: "Harel, Eden Tayre",
		19414: "Holowczak, Christopher David",
		18367: "Holstein, Charli Abigail",
		19285: "Hom, Matthew John",
		19488: "Kret, Lauren Gari",
		25526: "Levy, Frances Rebecca",
		20846: "McClard, Solian Kim",
		18451: "Molokwu, Stephanie Nneka",
		19337: "Osner, Sylvia Ching-Jen K",
		18310: "Pettigrew, William Reed",
		19573: "Ribicoff, Gabriel Abraham Herna",
		18431: "Schneiderman, Isabel Antonia",
		19401: "Schwartzbard, Lauren Elizabeth",
		19357: "Soles-Torres, Tran Thanh",
		19240: "Wallin, Michael Louis",
		18746: "West, Yajedah Abeo"
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