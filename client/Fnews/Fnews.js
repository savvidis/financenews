
// Template.home.rendered = function () {
// 	var index = 0 ;
// 	function counterindex() {
// 		return index += 1;
// 	};
// };

Template.summary.helpers({
	content: function () {
		return this.PostContent;
	}
});

Template.home.helpers({
	'headlines': function() {
	}
});
Template.home.rendered = function () {
// window.scrollTo(0,Session.get('scrollposition')||0);

Meteor._reload.onMigrate('LiveUpdate', function(retry) {
      console.log("RELOADING LIVe UPDATE");
      return [false];
  }); 
};

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
	// 'click .update' : function () {
	// 	Router.route.controller.PostsListController.extendedposts();
	// }
});

Template.url.rendered = function () {

};

Template.url.helpers({
	shorttitle: function() {
		return this.title.substring(0,85);
	},
	 hours : function () { return Math.round((Math.abs(new Date().getTime() - Date.parse(this.PostDate))) / (1000 * 3600));},
	 hoursordays : true,
	  minutesorhours: function() {
	  	return ;
	  }
   //    hoursordays: function() {
   //    	 	console.log(this.__proto__.hours());
   //    	 	console.log(this.__proto__.datenow.getTime() , Date.parse(this.__proto__.PostDate));

   //    	return (this.__proto__.hours() < 24);}
});


Template.summary.events({
	'click .backpos': function (e) {
	     e.preventDefault(); 
		 Router.go(Router.routes.home.path({postsLimit: Session.get('postLimit')}));
	}
});


// db.updates.remove({"date":{"$lt":ISODate("2015-03-10T16:51:28.980Z")}});
// db.posts.remove({"PostDate":{"$lt":ISODate("2015-03-10T16:51:28.980Z")}});
