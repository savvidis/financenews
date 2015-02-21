var checktime=10000;
var interval=10000;

function getime() {
	return Session.set('time', Date.now);
}

function getlastupdate () {
Meteor.call('getlastupdate', function (err,res){
	if (err) throw err;
	console.log(res);
    Session.set('updated',res);
});
}
function update () {
Meteor.call('getHeadlines',function(error,result){
		if (error) {console.log(error);}
		else {
			console.log("Updated at" + Date.now());
		}
	});

getlastupdate();

}


if (Meteor.isClient) {

getlastupdate();
var updated = Session.get('updated');
 Meteor.bindEnvironment(
Meteor.setInterval(
	function(updated) {
		if (Meteor.status().connected) {
			console.log(Date.now()- Session.get('updated'));
			if (Date.now()- Session.get('updated') >600000) {
				console.log("updating");
			update();
			}
		}
		},interval));

}	
