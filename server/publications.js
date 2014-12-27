Meteor.publish('newsPosts', function(options) {
  console.log('published');
  return Posts.find({},options);
});