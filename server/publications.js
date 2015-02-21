Meteor.publish('newsPosts', function(options) {
  return Posts.find({},options);
});

Meteor.publish('updates', function() {
  return Updates.find({});
});