Meteor.publish('newsPosts', function(options) {
  return Posts.find();
});

Meteor.publish('updates', function() {
  return Updates.find({});
});