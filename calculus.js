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
      {filename: '"cb1969ab45.png"', answer: "D",category: 22},

      {filename: '"cb1988bc1.png"', answer: "A",category: 37},
      {filename: '"cb1988bc2.png"', answer: "D",category: 30},
      {filename: '"cb1988bc3.png"', answer: "B",category: 22},
      {filename: '"cb1988bc4.png"', answer: "E",category: 15},
      {filename: '"cb1988bc5.png"', answer: "C",category: 11},
      {filename: '"cb1988bc6.png"', answer: "C",category: 18},
      {filename: '"cb1988bc7.png"', answer: "A",category: 41},
      {filename: '"cb1988bc8.png"', answer: "A",category: 20},
      {filename: '"cb1988bc29.png"', answer: "B",category: 38},
      {filename: '"cb1988bc30.png"', answer: "C",category: 42},
      {filename: '"cb1988bc31.png"', answer: "C",category: 31},
      {filename: '"cb1988bc32.png"', answer: "E",category: 33}
];  

var question_number = 12;
var number_correct = 0;
var assessment_interval = 28*60;
var feedback_interval = 12*60;
var clock = assessment_interval + feedback_interval + 1;

var timeLeft = function() {
  if (clock > feedback_interval) {
  // assessment phase
    // the slice pads the display with a zero when necessary.
    clock--;
    Session.set('display_minutes',("0" + Math.floor(clock/60)).slice(-2));
    Session.set('display_seconds',("0" + clock % 60).slice(-2));  
    return Session.set("time", clock);
  } else if (clock > 0) {
  // feedback phase
    if (clock === feedback_interval){
	Session.set('suffix','soln');
	question_number = 12;
	Session.set('filename','<img src=' + questions[question_number].filename.slice(0,-5) + Session.get('suffix') + '.png"/>');	  
	$('#question_container').html(Session.get('filename'));  	  
    }  
    clock--;
    Session.set('display_minutes',("0" + Math.floor(clock/60)).slice(-2));
    Session.set('display_seconds',("0" + clock % 60).slice(-2));  
    Session.set('suffix','soln');  
    return Session.set('which_phase','feedback_phase');
  } else {
    Session.set('summary',$('#summary').val());  
    Meteor.call('sendEmail',
            'scottstornetta@gmail.com',
            'postmaster@sandboxf8806a27e1324167a14b02281f6647b3.mailgun.org',
	    'Homework results April 6, 2016',
            Session.get('summary'));
    return Meteor.clearInterval(interval);
  }

};
var interval = Meteor.setInterval(timeLeft, 1000);

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Session.setDefault('number_correct',0);
  Session.setDefault('which_phase','assessment_phase');
  Session.setDefault('filename','"cb1969ab3.png"');
  Session.setDefault('suffix','');
  Session.setDefault('summary','Enter your name and what you learned.');
// generic function to retrieve any session variable
// {{session 'foo'}} to use in html the value of session variable foo.
  Template.registerHelper('session',function(input){
    return Session.get(input);
  });  
// single-purpose function because you can't use the session function in some cases.
  Template.registerHelper('whichPhase',function(){
  return Session.get('which_phase');
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
    Session.set('filename','<img src=' + questions[question_number].filename.slice(0,-5) + Session.get('suffix') + '.png"/>');	  
    $('#question_container').html(Session.get('filename'));  	  

  }
});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
      process.env.MAIL_URL = "smtp://postmaster%40sandboxf8806a27e1324167a14b02281f6647b3.mailgun.org:49f4e4c0a4f2de3ea09c53d6cab67f86@smtp.mailgun.org:587";
});
    // code to run on server at startup


Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  }
});
}
