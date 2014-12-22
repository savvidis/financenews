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


Router.onBeforeAction('loading');

PostsListController = RouteController.extend({
  template: 'home',
  postsOptions: function() { 
    return {sort:{submitDate:1,_id:-1},limit:100}; 
  },
  subscriptions: function() {
    return Meteor.subscribe('newsPosts',this.postsOptions());
  },
  extendedposts : function() {
    var datenow = new Date();
    var posts = Posts.find({},this.postsOptions()).fetch();
    var newposts = [];
     _.map(posts, function(post) {
      var timeDiff = Math.abs(datenow.getTime() - Date.parse(post.submitDate)); 
      var hoursdiff = Math.ceil(timeDiff / (1000 * 3600));
      var minutesdiff = Math.ceil(timeDiff / (1000 * 60));
      var daysdiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      _.extend(post, 
      { 
        hours : hoursdiff,
        minutes : minutesdiff,
        days:daysdiff,
        minutesorhours : function () { 
          return (this.minutes < 60);},
        hoursordays : function () { 
          return (this.hours < 24);  
        }

      });
      newposts.push(post);
    }
    );

    return newposts.sort(function(a,b){
      return a.hours-b.hours ;
    });

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

