

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  alert('one step before question container assignment');
  $('#question_container').html('<img src="cb1969ab3.png"/>');
  alert('one step after question container');
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

Template.body.helpers({
    questions: [
      { filename: "cb1969ab3.png" },
      { filename: "cb1969ab3.png" },
      { filename: "cb1969ab3.png" }
    ]
  });

  Template.body.events({  
      'click :button': function(event, template) {
    var element = template.find('input:radio[name=multiple_choice]:checked');
//  if element.length() == 0, haven't clicked anything.  submit should remain
//  greyed out until something is chosen.
    console.log($(element).val());
    $('#question_container').html('<img src="cb1969ab3.png"/>');
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
