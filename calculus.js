var questions = [
      {filename: '"cb1969ab3.png"', answer: "B",category: 11},
      {filename: '"cb1969ab7.png"', answer: "D",category: 21},
      {filename: '"cb1969ab9.png"', answer: "C",category: 24}
];  

var question_number = 0;
var number_correct = 0;

var clock = 10;
var timeLeft = function() {
  if (clock > 0) {
    clock--;
    Session.set("time", clock);
    return console.log(clock);
  } else {
    console.log("That's All Folks");
    return Meteor.clearInterval(interval);
  }
};
var interval = Meteor.setInterval(timeLeft, 1000);



if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('number_correct',0);
// generic function to retrieve any session variable
// {{session 'foo'}} to use in html the value of session variable foo.
  Template.registerHelper('session',function(input){
    return Session.get(input);
  });  

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.body.events({  
      'click :button': function(event, template) {
    var element = template.find('input:radio[name=multiple_choice]:checked');
//  if element.length() === 0, haven't clicked anything.  submit should remain
//  greyed out until something is chosen.

    if ($(element).val() === questions[question_number].answer) {number_correct += 1;}  
    Session.set('number_correct',number_correct);	  
    $('input[name="multiple_choice"]').prop('checked', false);
    question_number += 1;	  
    $('#question_container').html('<img src=' + questions[question_number].filename +'/>');  	  

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
