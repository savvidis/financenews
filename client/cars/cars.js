Meteor.call('getCars', function(error,result){
 	Session.set('cars', result);
 });