var questions = [
      {filename: '"cb1969ab3.png"', answer: "B",category: 11},
      {filename: '"cb1969ab7.png"', answer: "D",category: 21},
      {filename: '"cb1969ab9.png"', answer: "C",category: 24},
      {filename: '"cb1969ab14.png"', answer: "E",category: 19},
      {filename: '"cb1969ab22.png"', answer: "E",category: 20},
      {filename: '"cb1969ab23.png"', answer: "C",category: 37},
      {filename: '"cb1969ab29.png"', answer: "A",category: 30},
      {filename: '"cb1969ab30.png"', answer: "E",category: 22},
      {filename: '"cb1969ab37.png"', answer: "D",category: 43},
      {filename: '"cb1969ab38.png"', answer: "C",category: 30},
      {filename: '"cb1969ab43.png"', answer: "D",category: 30},
      {filename: '"cb1969ab45.png"', answer: "D",category: 22}
];  

var question_number = 0;
var number_correct = 0;

var clock = 1800;
var timeLeft = function() {
  if (clock > 0) {
    clock--;
    return Session.set("time", clock);
  } else {
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
