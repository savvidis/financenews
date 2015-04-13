Posts = new Meteor.Collection('posts');
// GroundPosts = new Ground.Collection(Posts);

Posts.allow({
  update: function () {return true;},
  remove: function () {return true;},
});

Updates = new Meteor.Collection('updates');

