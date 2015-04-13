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



function UpdateGrav (posts) {
  Meteor.call('updateGrav', posts, function (error, result) {
      if (error) throw error;
      Session.set('gravsort',true);
      console.log("update grav");
  });
}

    var datenow = new Date();
    var start = new Date(Date.now() - 1000*60*60*24*7); 
    var findquery = { 'PostDate' : { $gte : start}};
    var findoptions = {sort:{gravitylevel:-1},limit:50, reactive: false};
// Router.onBeforeAction('loading');  

PostsListController = RouteController.extend({
  template: 'home',
  increment: 50, 
  postsLimit: function() { 
    return parseInt(this.params.postsLimit) ||this.increment; 
  },
  postsOptions: function() { 
    return {sort:{gravitylevel:-1}, fields:{title:1,source:1,gravitylevel:1,PostDate:1,score:1}, limit:this.postsLimit(), reactive: false}; 
  },
  nextPath: function() {
    if(Meteor.isClient) {
     var limit = this.postsLimit() + this.increment;
     Session.set('postLimit', this.postsLimit());
     Session.set('scrollposition', window.scrollY);
     return Router.routes.home.path({postsLimit: this.postsLimit() + this.increment});
     }
  },
   onAfterAction: function (pause) {
    if(Meteor.isClient) {
      window.scrollTo(0,Session.get('scrollposition')||0);
      Session.set('posts', this.data().posts.fetch());
      Session.set('nextpost', null);
     }
  },
  subscriptions: function() {
      sub = Meteor.subscribe('newsPosts',this.postsOptions());
      runSub=false;
      console.log('run sub');
    // console.log(this.data().posts.count(),parseInt(this.postsLimit()));
    return sub; 
  },
  waitOn: function() {
        return this.subscriptions();
       // return Meteor.subscribe('newsPosts',this.postsOptions());
  //   // return Router.current().subscriptions();
  },
  // action : function () {
  //      if (this.ready() && Meteor.subscribe('newsPosts').ready()) {
  //          this.render();
  //      }
  // },  
  onStop: function(){
     Session.set("previousLocationPath",'/');
  },
  data: function() {
    console.log(this.postsLimit());
    // var sortednewposts =  Posts.find(findquery,this.postsOptions());   
    return {
      posts: Posts.find(findquery,this.postsOptions()),
      nextPath: true ? this.nextPath() : null  
      // findoptions: this.postsOptions()
  };
  }
});



Router.map(function () {
  this.route('home', { 
    path:'/:postsLimit?',
    controller: PostsListController,
    fastRender: true
  });


  this.route('content',{
    path:'/news/:title',
    template:'summary',
    onStop: function(){
     Session.set("previousLocationPath",this.location.get().path);
    },
    onBeforeAction: function() {
     Session.set('scrollposition', window.scrollY);
     this.next();
    },
    waitOn: function() {
     var title =  this.params.title ;
     return Meteor.subscribe('singlePost',title);
    },
    data: function () {
     var title = this.params.title;
      return Posts.findOne({title:title},{fields:{PostContent:true,title:true,source:true},reactive: false});
       
    },
    onAfterAction: function() {
     $(document).scrollTop(0);
     posts = Session.get('posts');
     posthis = (posts.map(function(e) { return e.title; })).indexOf(this.data().title);
     posnext = posts[posthis+1];
     Session.set('nextpost', posnext.title);
    },
    fastRender: true
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

// Tracker.nonreactive(function(){})
