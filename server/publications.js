Meteor.publish('newsPosts', function(options) {
  return Posts.find({},options);
});

Meteor.publish('singlePost', function(title) {
  return Posts.find({title:title},{fields:{PostContent:1,title:1,source:1,Min:1,url:1}});
});

Meteor.publish('updates', function() {
  return Updates.find({});
});

Meteor.publish("userData", function () {
    return Meteor.users.find({});
});

Meteor.publish('CachePosts', function(options) {
  return Posts.find({},options);
});