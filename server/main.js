import { Meteor } from 'meteor/meteor';

import { Tests } from '../api/tests.js'
import { Scores } from '../api/scores.js'

Meteor.startup(() => {
  // code to run on server at startup
	if(Tests.find().count() === 0)
  		Tests.insert({spoof: true});

	if(Scores.find().count() === 0)
  		Scores.insert({spoof: true});
});