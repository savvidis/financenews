Meteor.publish('newsPosts', function() {
  return Posts.find();
});