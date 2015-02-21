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
    return {sort:{submitDate:1,_id:-1},limit:500}; 
  },
  subscriptions: function() {
    return [Meteor.subscribe('newsPosts',this.postsOptions()),Meteor.subscribe('updates')];
  },
  extendedposts : function() {
    var gravitylevel ={'blog':1.2,'news':1.3,'flashnews':1.5};
    var datenow = new Date();
    var posts = Posts.find({},this.postsOptions()).fetch();
    var newposts = [];
    _.map(posts, function(post) {
      // TIME AFTER SUBMITION
      var timeDiff = Math.abs(datenow.getTime() - Date.parse(post.PostDate)); 
      var hoursdiff = Math.ceil(timeDiff / (1000 * 3600));
      var minutesdiff = Math.ceil(timeDiff / (1000 * 60));
      var daysdiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
 
      // SCORE TIME
      if (post.commentsfeed) {
       post.score = Math.round(post.score  * (0.8 + post.CommentsNumber/ 30));
      }
      
      var gravity = Math.pow(post.score,1+(post.quality/10))/Math.pow(Math.ceil(hoursdiff+1), gravitylevel[post.type]);

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
    // console.log(sortednewposts);

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
    controller: PostsListController,
    waitOn: PostsListController.data 
  });
  this.route('content',{
    path:'/:title',
    template:'summary',
    subscriptions: function() {
    return Meteor.subscribe('newsPosts');
    },
    // waitOn: function() { 
    //     var title = this.params.title;
    //   return Posts.findOne({title:title});},
    data: function () {
      var title = this.params.title;
      return Posts.findOne({title:title});
    }
  });
  this.route('comments', { 
    path:'/:_id'
  }); 
});

