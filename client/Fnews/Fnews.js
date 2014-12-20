Meteor.call('getHeadlines', function(error,result){
	if (error) {console.log(error);}
	else {
		console.log("Updated at" + Date.now());
	}

});

Template.home.helpers({
	'headlines': function() {
		return this.posts;
	}

});

