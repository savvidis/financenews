





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
		return this.posts;
	},

			});

Template.url.helpers({
	// addindex : function(counterindex){
	// 	this.index +=1;
	// 	return this.index;

	// 	}
	});