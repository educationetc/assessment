  var questions = [
      {filename: '"cb1969ab3.png"', answer: "B",category: 11},
      {filename: '"cb1969ab7.png"', answer: "D",category: 21},
      {filename: '"cb1969ab9.png"', answer: "C",category: 24}
  ];  

  var question_number = 0;

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
//  now need to add something which compares $(element).val() with questions[question_number].answer, and increments number_correct.  number_correct needs to be a session variable so we can auto-update the display?
    console.log($(element).val());
    question_number = question_number + 1;	  
    $('#question_container').html('<img src=' + questions[question_number].filename +'/>');
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
