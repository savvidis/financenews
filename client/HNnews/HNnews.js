Meteor.call('getHeadlines', function(error,result){
 	Session.set('data', result);
 });

Template.home.helpers({
 	'headlines': function() {
 		return Posts.find();
 }
});