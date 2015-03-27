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
  }
});


// Router.onBeforeAction('loading');  

PostsListController = RouteController.extend({
  template: 'home',
  increment: 25, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) ||this.increment; 
  },
  postsOptions: function() { 
    return {sort:{gravitylevel:-1}, fields:{Words:0,PostContent:0}, limit:this.postsLimit()}; 
  },
  nextPath: function() {
     var limit = this.postsLimit() + this.increment;
     Session.set('postLimit', this.postsLimit());
     Session.set('scrollposition', window.scrollY);
     return Router.routes.home.path({postsLimit: this.postsLimit() + this.increment});
  },
  subscriptions: function() {
    return [Meteor.subscribe('newsPosts',this.postsOptions()),Meteor.subscribe('updates')];
  },
  extendedposts : function() {
  var gravitylevel ={'blog':1.4,'news':1.6,'flashnews':1.8};
      var datenow = new Date();
      var start = new Date(Date.now() - 1000*60*60*24*7); 
 
      var posts = Posts.find({ 'PostDate' : { $gte : start}},this.postsOptions()).fetch();
      
     // var prop =  {
     //    datenow: function () {return new Date();},
     //    timeDiff: function () {return Math.abs(this.datenow().getTime() - Date.parse(this.PostDate));},
     //    hours : function () { return Math.round(this.timeDiff() / (1000 * 3600));},
     //    minutes : function () {return Math.round(this.timeDiff() / (1000 * 60));},
     //    days : function () {return Math.round((this.timeDiff() / (1000 * 3600 * 24)));},
     //    updatedscore: function() {if (this.commentsfeed) {
     //           return Math.round(this.score  * (0.8 + this.CommentsNumber/ 30));
     //         }
     //      else return this.score;
     //    },
     //    gravity: function() {return (Math.pow(this.updatedscore()*100,1+(this.quality/10))/Math.pow(Math.ceil(this.hours()+1), gravitylevel[this.type])).toFixed(2);}
     //    };
     
       // var sortedposts = _.sortBy(posts, function(post) {
       //  post.__proto__ = new Object(prop); 
       //  // console.log(post.datenow());
       //  // console.log(post.timeDiff());
       //  // console.log(post.hours());
       //  // console.log(post.commentsfeed);
       //  // console.log(post.score);
       //  // console.log(post.updatedscore());
       //  }).sort(function(a, b) { 
       //    if ((b.gravity() - a.gravity()) === 0) { 
       //      return b.gravity()+1 - a.gravity();
       //    }
       //    return b.gravity() - a.gravity();
       //    });

       Meteor.call('updateGrav', posts, function (error, result) {
        if (err) throw err;
        console.log("update grav");
       });

       return posts;
  },

  data: function() {
    var sortednewposts = this.extendedposts();
    var hasMore = sortednewposts.length === this.postsLimit();
    return {
      ready: this.subscriptions,
      posts: sortednewposts,
      nextPath: hasMore ? this.nextPath() : null
      
    };
  }
});



Router.map(function () {
  this.route('home', { 
    path:'/:postsLimit?',
    controller: PostsListController,
    // waitOn: PostsListController.subscriptions,
    onAfterAction: function (pause) {
      window.scrollTo(0,Session.get('scrollposition')||0);
    },
    // onBeforeAction: function() {
    // if (Session.get('postLimit')) {
    //     Router.go('/'+Session.get('postLimit'));
    // }
    // this.next();
    // },
    fastRender: false
  });

  this.route('/more/:postsLimit?', {
    name: 'addPosts',
    controller: PostsListController,
    waitOn: PostsListController.data,
    fastRender: false
  });

  this.route('content',{
    path:'/news/:title',
    template:'summary',
    onBeforeAction: function() {
     Session.set('scrollposition', window.scrollY);
     this.next();
    },
    subscriptions: function() {
    return Meteor.subscribe('singlePost');
    },
    // waitOn: function() { 
    //     var title = this.params.title;
    //   return Posts.findOne({title:title});},
    data: function () {
      return Posts.findOne({title:this.params.title},{PostContent:true,title:true});
    },
    onAfterAction: function() {
     $(document).scrollTop(0);
    },
    fastRender: false
  });

});

// Meteor.Router.filters({
//     resetScroll: function(page) {
//         if (!(page===Session.get('Router.lastPage'))) {
//             Session.set('Router.lastPage',page);
//             Meteor.startup(function() {window.scrollTo(0,0)});
//         }
//         return page;
//     }
// });

