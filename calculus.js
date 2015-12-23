Multiple_Choice_Questions = new Mongo.Collection("mc_questions");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.body.events({  
      'click :button': function(event, template) {
    var element = template.find('input:radio[name=multiple_choice]:checked');
//  if element.length() == 0, haven't clicked anything.  submit should remain
//  greyed out until something is chosen.
    console.log($(element).val());
//  compare chosen value to correct answer and move to next problem.
//  have graphics of three problems with corresponding answer.

  }
});

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
