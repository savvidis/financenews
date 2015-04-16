function UpdateGrav () {
 	Meteor.call('updateGrav', Router.current().data().posts, function (error, result) {
	    if (error) throw error;
	    Session.set('gravsort',true);
	    console.log("update grav");
	});
}


Template.home.rendered = function () {
 // if (!Session.get('gravsort')) {
 //     Meteor.wrapAsync(UpdateGrav());
 // }
// window.scrollTo(0,Session.get('scrollposition')||0);
// Meteor._reload.onMigrate('LiveUpdate', function(retry) {
//       console.log("RELOADING LIVe UPDATE");
//       return [false];
//   }); 
};


Template.home.helpers({
	'headlines': function() {
		// console.log(this);
		return this.posts.fetch();
  // var datenow = new Date();
  // var start = new Date(Date.now() - 1000*60*60*24*7); 
  // var findquery = { 'PostDate' : { $gte : start}};
  // return Posts.find(findquery,this.findoptions).fetch();
		
	}
});


Template.home.events({
	'click .scrap': function() {
	
	// Setting function
	function getime() {
		return Session.set('updated', Date.now());
	}

	function getlastupdate () {
	Meteor.call('getlastupdate', function (err,res){
		if (err) throw err;
		console.log(res);
	    Session.set('updated',res);
	});
	}

	function update () {
	initial_time = Date.now();
	
	Meteor.call('getHeadlines',function(error,result){
			if (error) {console.log(error);}
			else {
				var time_needed = Date.now() - initial_time;
				Updates.insert({'ms':Date.now(),'date':new Date()});

				console.log("Updated at " + new Date(), "in ", time_needed/1000/60," mins" );
				Meteor.call('getlastupdate', function (err,res){
					if (err) throw err;
					console.log(res);
				    Session.set('updated',res);
				}); 
		      	}
				 Meteor.call('cleanagent', function() {
					console.log("Cleaned " + new Date());
				});
		});
	}	

	// Running 
	Meteor.call('getlastupdate', function (err,res){
		if (err) throw err;
		console.log(res);
	    console.log(Date.now()/1000- res/1000);
	    if (Date.now()- res >600000) {
				console.log("updating");
			    update();
			    return true;
			} else {
				console.log("already updated");
		}	
	});	
	},
	'click .update' : function (e) {
		e.preventDefault(); 
		var start = new Date(Date.now() - 1000*60*60*24*7);  
		params = Router.current().params.postsLimit || 50;
		var options =  {sort:{gravitylevel:-1}, limit:params, fields:{Words:0}, reactive: false};
		GroundPosts = new Ground.Collection(Posts);
		Meteor.subscribe('CachePosts',options, function() {
			Posts.find(start,options);
		});
		Session.set('scrollposition', 0); 
		subscribed = false;
		// Meteor._reload.reload();
		Router.go(Router.routes.home.path({postsLimit: params}));
		
	},
	'click .tinder' : function (e) {
		e.preventDefault(); 
		Session.set('btb', true);
		// Meteor._reload.reload();posnext
	    Router.go(Router.routes.content.path({title:$('body > div > div.leaderboard > a:nth-child(1) > div > div > div.name > span.counterspan').text(),btb:true}));

		
	}

});

Template.url.rendered = function () {
	this.hours = Math.round((Math.abs(new Date().getTime() - Date.parse(this.PostDate))) / (1000 * 3600));
};

Template.url.helpers({
	shorttitle: function() {
		return this.title.substring(0,90);
	},
	 hours : function() {
	 	 return Math.round((Math.abs(new Date().getTime() - Date.parse(this.PostDate))) / (1000 * 3600));},
	 hoursordays : function() { return (Math.round((Math.abs(new Date().getTime() - Date.parse(this.PostDate))) / (1000 * 3600)) < 24);},
	 days : function() {return Math.round(((Math.abs(new Date().getTime() - Date.parse(this.PostDate))) / (1000 * 3600)) / 24);}
	  
   //    hoursordays: function() {
   //    	 	console.log(this.__proto__.hours());
   //    	 	console.log(this.__proto__.datenow.getTime() , Date.parse(this.__proto__.PostDate));

   //    	return (this.__proto__.hours() < 24);}
});


Template.summary.helpers({
	content: function () {
		return this.PostContent;
	},
	shortContent: function() {
		console.log(this.Min);
		var post = this.PostContent;
		var limit = Math.max(Math.min(parseFloat(this.Min)*250,3200),1000);
		return post.substring(0, limit);
	}
});

Template.summary.events({
	'click .backup': function (e) {
	     e.preventDefault(); 
	     Meteor.call('upPost', this._id, function (error, result) {
	     	if (error) throw error;
	     });
	     if (Session.get('btb')) {
		 Router.go(Router.routes.content.path({title: Session.get('nextpost')}));
		 } else {
		 Router.go(Router.routes.home.path({postsLimit: Session.get('postLimit')}));
	 	}
	},
	'click .backdown': function (e) {
	     e.preventDefault(); 
	     Meteor.call('downPost', this._id, function (error, result) {
	     	if (error) throw error;
	     });
	     if (Session.get('btb')) {
	     Router.go(Router.routes.content.path({title: Session.get('nextpost')})); 
	 	} else {
		 Router.go(Router.routes.home.path({postsLimit: Session.get('postLimit')}));
	 	}
	}	
});


// db.updates.remove({"date":{"$lt":ISODate("2015-03-10T16:51:28.980Z")}});
