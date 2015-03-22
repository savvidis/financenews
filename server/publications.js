Meteor.publish('newsPosts', function() {
  return Posts.find({},{PostContent:false,Words:false});
});

Meteor.publish('singlePost', function() {
  return Posts.find({},{Words:false});
});

Meteor.publish('updates', function() {
  return Updates.find({});
});