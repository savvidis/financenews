Meteor.startup(function () {
  request = Meteor.npmRequire('request');
  async = Meteor.npmRequire('async');
  cheerio = Meteor.npmRequire('cheerio');

});

Meteor.methods({
  getHeadlines : function (argument) {
    this.unblock();
    var concurrency = 3;

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
      }
    } 
    var list = [];

    var scrapHeadlines = function (newsource) {
      var options = {
        url: newsource.url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Cache-Control':'max-age=0'
        }
      };
      
      request(options, function (err, response, body) {
        if (err) throw err;
     
      var $ = cheerio.load(body);
      // console.log($.html());  
      var resp = $(newsource.UrlCssSelector);
      // console.log(resp);
      var Newslist= [];
      var obj ={};
      var initialscore =10;
      var datenow = new Date();
      var sourceurl = newsource.url;
  Fiber = Meteor.npmRequire('fibers');
  Fiber(function() { 
      resp.each(function (i,element) {
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
  console.log(title + '---' + element.attribs.href);
  obj  = {type:newsource.type,'score':initialscore,'source':newsource.source,'title': title,'url':correcturl,'submitDate':datenow};
  
      var lookedObj = Posts.findOne({'title':obj.title });
  
  if (!lookedObj){

    //WE GET THE DATA FROM EACH POST
    extraxtData(obj.url,function(error,success){
      if (error) {console.log(error);}
      else {console.log(success);}
    });

    Posts.insert(obj, function() {

      console.log('entered');
    });
  } 
  else if (lookedObj.title) {

    var updatedData  = { 
    // score:comments
  };
  Posts.update({'_id':lookedObj._id},{$set:updatedData}, function() {
    console.log('updated');
  });

}

Newslist.push(obj);
});
}).run();
return Newslist; 

function extraxtData(url) {
  var result =  Meteor.http.call('GET',url, {headers: {'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)','Cache-Control':'max-age=0'}});
  $ = cheerio.load(result.content); 
  console.log($(newsource.subDateCssSelector).text());
  console.log('i am inside');
  console.log($(newsource.subDateCssSelector).text());
  console.log(new Date(Date.parse($(newsource.subDateCssSelector).text().replace(/th|st|nd|at|AM|\./g , ""))));
  obj.PostContent = $(newsource.contentCssSelector).text().replace(/\n/g , "").trim();

  obj.PostDate = new Date(Date.parse($(newsource.subDateCssSelector).text().replace(/th|st|nd|at|AM|\./g , "")));
  obj.CommentsNumber = parseInt($(newsource.commentCssSelector).text()) || 0 ;
  // console.log( obj.PostContent, obj.PostDate,obj.CommentsNumber );  
  return obj;
}
});

};


async.eachLimit(sources, concurrency, function (newsource, next) {
  list = list.concat(scrapHeadlines(newsource));
  console.log(list);
next();
});


return list;

}, 
cleanPosts : function() {
  this.unblock();
  var removeObj = {
  'subDateCssSelector': null
};


Posts.remove(removeObj, function(result,error) {
  if (error) {
    console.log(error);}
    else
      console.log('removed' + result);
  });
},
getNewspost: function(url) {
  result = Meteor.http.get(url);
  $ = cheerio.load(result.content);
  var ads = $('table .list > tbody> tr');
    // title , postdate, summary, comments{ comment}
    var title = $('.syndicationHeadline > h1:nth-child(2)').text();
    var tag = $('.pagename > span:nth-child(1) > a:nth-child(1)').text();
    var summary = ('#storyContent > p:nth-child(2)').text(); 
  }
});






 // 'http://www.economist.com/') '#latest-updates > article > p > a');

// http://www.ft.com/home/uk