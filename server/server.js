Meteor.startup(function () {
  request = Meteor.npmRequire('request');
  async = Meteor.npmRequire('async');
  cheerio = Meteor.npmRequire('cheerio');

});

Meteor.methods({
  getHeadlines : function (argument) {
    this.unblock();
    Fiber =  Meteor.npmRequire('fibers');
    var concurrency = 10;

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
      }
    } 
    var list = [];



// GET URLS FROM 
// EACH OF THE DOMAINS
// --------------

function scrapHeadlines(newsource) {
  var options = {
    url: newsource.url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Cache-Control':'max-age=0',
      "Referer": "http://www.google.com/"
    }
  };

  request(options, function (err, response, body) {
    if (err) throw err;

     var $ = cheerio.load(body);
      // console.log($.html());  
      var resp = $(newsource.UrlCssSelector);
      // console.log(resp);
      var obj ={};
      var initialscore =10;
      var datenow = new Date();
      var sourceurl = newsource.url;

      // _.each(resp,function (element, next) {
      //   ObjFromHeadline(element);
      // });

    var index =0;
    console.log('\n \n');
    console.log('@@@@@@@@@@@@@@@@@@@@@@  Starting ',newsource.source,' @@@@@@@@@@@@@@@@@@@@@@');
    console.log('\n');

    async.eachLimit(resp, concurrency, function (element, next) {
      index =+ 1;
      ObjFromHeadline(element,index);
      next();
    });


function ObjFromHeadline (element,index) {
      // console.log(element);
      // Fiber(function() { 
        var hastitle = function () {
          if($(element).text()) {
            return $(element).text().trim();}
            else {
              return element.attribs.href();
            }
          };
          // Scoring must take place here 
           // eg. Comments, Source, Gravity     
           var title = hastitle();
           var correcturl;
           if (element.attribs.href.substring(0,4) != 'http') {
            correcturl = sourceurl + element.attribs.href; 
          }
          else { 
            correcturl = element.attribs.href;
          }
          console.log(index+".Title : "+title + '\n'+'  URL : ' + element.attribs.href);
          console.log("");
          var obj = {'type':newsource.type,'commentsfeed':newsource.commentsfeed, 'quality':newsource.quality,'score':initialscore,'source':newsource.source,'title': title,'url':correcturl,'submitDate':datenow};
          filePost(obj);
      // }).run();
}


    // Check the PoST 
    // Insert/Update
    // --------------

    function filePost (obj){
      Fiber(function() { 
        var findpost = Posts.findOne({'title':obj.title });
        console.log("++++ Post exist ? ",!!findpost);
        if (!findpost){
      //WE GET THE DATA FROM EACH POST
      insertPost(extraxtData(obj));
    } 
    // else if (findpost.title) {
    //   var updatedData  = { 
    // // score:comments
    // };
    // Posts.update({'_id':findpost._id},{$set:updatedData}, function() {
    //   console.log('updated');
    // });
    // }
  }).run();
    }

    function insertPost (obj){
      Posts.insert(obj, function() {
        console.log('entered');
      });  
    }

// GET DATA
// FROM EACH POST
// --------------

function extraxtData(obj) {
  var result =  Meteor.http.call('GET',obj.url, {headers: {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)','Cache-Control':'max-age=0'}});
  $ = cheerio.load(result.content); 
  obj.PostDate = new Date(Date.parse(treatDate(newsource.subDateCssSelector)));
  console.log(getString(newsource.commentCssSelector));
  obj.CommentsNumber = !!(getString(newsource.commentCssSelector).match(/\d+/)) ? getString(newsource.commentCssSelector).match(/\d+/)[0] : "" ;
  obj.PostContent = getHTML(newsource.contentCssSelector);
      //   for $(newsource.contentCssSelector).html();


      console.log('\n \n');
      console.log("======================Start============================");
      console.log('i am inside: ',obj.url);
      console.log($(newsource.subDateCssSelector).text());
      console.log('Date: ',obj.PostDate);
      console.log('\n');
      console.log($(newsource.commentCssSelector).text());
      console.log('Comments: ',obj.CommentsNumber);
      console.log("======================Body============================");
      console.log(obj.PostContent.substring(0, 500));
      console.log("======================End============================");
      console.log('\n \n');
       // console.log( obj.PostContent, obj.PostDate,obj.CommentsNumber );  
       return obj;
  }
    //Helper
    function treatContent (node){
      node = node.remove('.shareArt');
      node = node.remove('.sharedaddy');
      return node.html();
    }

    function treatDate (node){
     var str = getString(node);
        str = str.substring(str.indexOf('-')+1);
        str = str.substring(0,str.indexOf('by'));
        str = str.replace(/th|st|nd|at|AM|am|pm|PM|by|Guest|Author|\./g , "");   
     if (str) {
        if (str.match(/\d+/g).length === 1) {
          str = str + " "+ datenow.getFullYear();
          return str;
        }
        var year;
        for (var i = 0; i < str.match(/\d+/g).length.length; i++) {
          if(str.match(/\d+/g).length[i].length ===4) {
             year = str.match(/\d+/g).length[i];
          }
        }
        if (!year) { str = str + " "+ datenow.getFullYear();}
        console.log(str);
      }
        return str ; 
      
      
    }

    function treatComments (node){
      if (typeof csslist === 'object' && csslist !== null) {
        return node[0];
      } 
    }     

    function getHTML (csslist) {
      if (typeof csslist === 'string' && !!($(csslist).html()) ) {
        return  $(csslist).html();
      }
      if (typeof csslist === 'object') {
        for (var i = 0; i < csslist.length; i++) {
          if (!!$(csslist[i]).html()) {
            return $(csslist[i]).html();
          }

        }

      }
      console.log("3");
      return "ERROR Didnt get content";
    }

    function getString (csslist) {
      if (typeof csslist === 'string' && !!($(csslist).text()) ) {
        return  $(csslist).length === 1 ? $(csslist).text() : $($(csslist)[0]).text();
      }
      if (typeof csslist === 'object') {
        for (var i = 0; i < csslist.length; i++) {
          console.log(csslist);
          if (!!$(csslist[i]).text()) {
            return $(csslist).length === 1 ? $(csslist).text() : $($(csslist)[0]).text();
          }

        }

      }
      console.log("3");
      return "";
    }  
  });

}



// MAIN
// RUN THE WHOLE THING
// HERE  
// --------------

async.eachLimit(sources, concurrency, function (newsource, next) {
  scrapHeadlines(newsource);
  next();
});

// _.each(sources,function (newsource) {
//   scrapHeadlines(newsource);
// });
Updates.insert({'ms':Date.now(),'date':new Date()},function() {

});

}, 
getlastupdate: function () {
  var lastupdate = Updates.findOne({}, {sort: {ms:-1}});
  return lastupdate.ms;
},

cleanPosts : function() {
  var removeObj = {
    // 'source': 'abnormalreturns.com/'
  };
  Posts.remove(removeObj, function(result,error) {
    if (error) {
      console.log(error);}
      else
        console.log('removed' + result);
    });
}
});




