Meteor.call('getHeadlines', function(error,result){
	if (error) {console.log(error);}
	else {
		console.log("Updated at" + Date.now());
	}

});

Meteor.call('cleanPosts', function(error,result){
	if (error) {console.log(error);}
	else {
		console.log("removed at" + Date.now());
	}

});

Handlebars.registerHelper('plusOne', function(number) {
    return number + 1;
});


// Template.home.rendered = function () {
// 	var index = 0 ;
// 	function counterindex() {
// 		return index += 1;
// 	};
// };

Template.home.helpers({
	'headlines': function() {
		return this.posts;
	},

			});

Template.url.helpers({
	// addindex : function(counterindex){
	// 	this.index +=1;
	// 	return this.index;

	// 	}
	});