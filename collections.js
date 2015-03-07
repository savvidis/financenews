Posts = new Meteor.Collection('posts');

Ground.Collection(Posts) ;

Posts.allow({
  update: function () {return true;},
  remove: function () {return true;},
});

Updates = new Meteor.Collection('updates');

