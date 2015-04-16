function getime() {
  return Session.set('updated', Date.now());
}

function getlastupdate() {
  Meteor.call('getlastupdate', function(err, res) {
    if (err) throw err;
    console.log(res);
    Session.set('updated', res);
  });
}


function update() {
  initial_time = Date.now();
  Meteor.call('getHeadlines', function(error, result) {
    if (error) {
      console.log(error);
    } else {
      var time_needed = Date.now() - initial_time;
      console.log("Updated at " + new Date(), "in ", time_needed / 1000 / 60, " mins");
      Meteor.call('getlastupdate', function(err, res) {
        if (err) throw err;
        console.log(res);
        Session.set('updated', res);
      });
    }
    Meteor.call('cleanagent', function() {
      console.log("Cleaned " + new Date());
    });
  });
}



Meteor.startup(function() {
  if (!Updates.find().fetch()) {
    Updates.insert({
      'ms': Date.now(),
      'date': new Date()
    }, getlastupdate());
  } else {
    // Meteor.call('getlastupdate', function (err,res){
    // 	if (err) throw err;
    // 	console.log(res);
    //     Session.set('updated',res);
    //     console.log(Date.now()/1000- Session.get('updated')/1000);
    //     if (Date.now()- Session.get('updated') >600000) {
    // 			Updates.insert({'ms':Date.now(),'date':new Date()},	getlastupdate ());
    // 			console.log("updating");
    // 		    update();
    // 		    return true;
    // 		} else {
    // 			console.log("already updated");
    // 	}	
    // });	
  }

  Accounts.ui.config({
    passwordSignupFields: 'EMAIL_ONLY'
  });

  AccountsEntry.config({
    logo: '',
    homeRoute: '/',
    dashboardRoute: '/',
    profileRoute: '/',
    verifyEmail: true,
    // verifyEmailRoute: '/checkmail',
    language: 'en',
    showSignupCode: false,
    extraSignUpFields: [
    {
      field: "username",
      label: "Username",
      type: "text",
      required: true
    },
    {
      field: "invitation",
      label: "Invitation Code",
      type: "text",
      required: true
    }
    ]
  });


  var sub = [];
  subscribed = false;
  Tracker.autorun(function() {
    if (!subscribed) {
      Meteor.subscribe('userData',function() {

      // Meteor.subscribe('newsPosts',{fields:{Words:0,PostContent:0}}, function(err,res) {
      //   if (err) throw err;
      //   console.log(res);
      // });
      Meteor.subscribe('updates');
      subscribed = true;
      return subscribed;  
      });

    }
  });

});



// if (Meteor.isServer) {

// }
