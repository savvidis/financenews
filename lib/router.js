Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loading',

  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },

onAfterAction: function() {
    $(document).scrollTop(0);
  }
});


// Router.onBeforeAction('loading');

PostsListController = RouteController.extend({
  template: 'home',
  postsOptions: function() { 
    return {sort:{submitDate:1,_id:-1},limit:200}; 
  },
  subscriptions: function() {
    return Meteor.subscribe('newsPosts',this.postsOptions());
  },
  extendedposts : function() {
  var gravitylevel ={'blog':1.3,'news':1.7,'flashnews':2};
    var datenow = new Date();
    var posts = Posts.find({},this.postsOptions()).fetch();
    var newposts = [];
     _.map(posts, function(post) {
      var timeDiff = Math.abs(datenow.getTime() - Date.parse(post.PostDate)); 
      var hoursdiff = Math.ceil(timeDiff / (1000 * 3600));
      var minutesdiff = Math.ceil(timeDiff / (1000 * 60));
      var daysdiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      console.log(post.type);

      console.log(gravitylevel[post.type]);
      console.log(Math.pow(hoursdiff+1, gravitylevel[post.type]));
      console.log(post.score);
      var gravity = Math.pow(post.score,0.5)/Math.pow(Math.ceil(hoursdiff+1), gravitylevel[post.type]);
      _.extend(post, 
      { 
        hours : hoursdiff,
        minutes : minutesdiff,
        days:daysdiff,
        gravity:gravity,
        minutesorhours : function () { 
          return (this.minutes < 60);},
        hoursordays : function () { 
          return (this.hours < 24);  
        }

      });

      newposts.push(post);
    }
    );
     
    var sortednewposts =newposts.sort(function(a,b){
      return b.gravity-a.gravity ;

    });
  console.log(sortednewposts);
  return sortednewposts;
  },
  data: function() {
    return {
      ready: this.subscriptions,
      posts: this.extendedposts()
      
    };
  }
});


Router.map(function () {
  this.route('home', { 
    path:'/',
    controller: PostsListController
  });
  this.route('comments', { 
    path:'/:_id'
  }); 
});

