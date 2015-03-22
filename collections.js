Posts = new Meteor.Collection('posts');
// Posts._ensureIndex({field: 1});
// Ground.Collection(Posts) ;

Posts.allow({
  update: function () {return true;},
  remove: function () {return true;},
});

Updates = new Meteor.Collection('updates');

