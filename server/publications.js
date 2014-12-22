Meteor.publish('newsPosts', function(options) {
  console.log('publish');
  return Posts.find({},options);
});