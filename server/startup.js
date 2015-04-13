function ScrapInteval () {
  console.log("Before Inter");
 Meteor.setInterval( function () {
     Meteor.call('getHeadlines', function(error, result) {
    if (error) {
      console.log(error);
    } else {
  	console.log("#####################################################");
    console.log("######## Updated Headlines at " + new Date() + " #########");
    console.log("#####################################################");

    }
    // db.posts.remove({"PostDate":{"$lt":ISODate("2015-03-10T16:51:28.980Z")}});
    console.log("2");
    Meteor.call('cleanagent', function() {
    	      	console.log("3");
      console.log("Cleaned " + new Date());
    });
      console.log("4");

  })
     ;},600000);
 }

 function updategravInterval() {
 Meteor.setInterval( function () {
    var posts = Posts.find({}).fetch();
     Meteor.call('updateGrav', posts,function(error, result) {
    if (error) {
      console.log(error);
    } else {
    console.log("#####################################################");
    console.log("######## Update Grag at " + new Date() + "   #########");
    console.log("#####################################################");
    }
  }); 
 },180000);
}

 function cleanDB () {
   var updateremovedate = new Date(Date.now() - 1000*60*60*24*5);  
   var postremovedate = new Date(Date.now() - 1000*60*60*24*14);  

   // Posts._dropIndex({title:1});
   // Posts._dropIndex({url:1});


   // Posts._ensureIndex({
   //    url: 1
   //  }, {
   //    unique: true,
   //    dropDups: true
   //  });
    
   Updates.remove({"date":{"$lt":updateremovedate}});
   Posts.remove({"PostDate":{"$lt":postremovedate}});
 }
// var connectHandler = WebApp.connectHandlers; // get meteor-core's connect-implementation

Meteor.startup(function() {
if (Meteor.isServer) {
  //allow connections
  // connectHandler.use(function (req, res, next) {
  //     res.header("Access-Control-Allow-Origin", "*");
  //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // 2592000s / 30 days
  //   return next();
  // });
  
  console.log("Server");
  Meteor.wrapAsync(cleanDB());
  Meteor.wrapAsync(ScrapInteval());
  Meteor.wrapAsync(updategravInterval());

}
});