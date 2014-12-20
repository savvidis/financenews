Meteor.call('getHeadlines', function(error,result){
	Session.set('data', result);
});

Template.home.helpers({
	'headlines': function() {
		var datenow = new Date();
		var posts = Posts.find({}, {sort: {submitted: -1, _id: -1}}).fetch();
		var newposts = [];
		 _.map(posts, function(post) {
			var timeDiff = Math.abs(datenow.getTime() - Date.parse(post.submitDate)); 
			var hoursdiff = Math.ceil(timeDiff / (1000 * 3600));
			console.log(post);
			_.extend(post, 
			{
				hours : hoursdiff
				
			});
			newposts.push(post);
		}
		);
	    console.log(newposts);

		return newposts.sort(function(a,b){
			return a.hours-b.hours ;
		});
	}

});

