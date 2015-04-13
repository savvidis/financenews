Meteor.startup(function() {
  async = Meteor.npmRequire('async');
  cheerio = Meteor.npmRequire('cheerio');

});



Meteor.methods({
  getHeadlines: function(argument) {
    this.unblock();
    var concurrency = 4;
    var Fiber =  Meteor.npmRequire('fibers');
    var datems = Date.now();
    var errindex = 0;
    var error= {};
    error[datems]= {};
    var list = [];
    Meteor.bindEnvironment(
    async.series([
      function(callback) {
        async.eachLimit(sources, concurrency, function(newsource, next, err) {
        try {
          scrapHeadlines(newsource);
        } 
        catch (e) {
           console.log("Uh-oh, Error!: " + e + "\n using " + newsource.source);
        }
        next();
        });
        // _.each(sources,function (newsource) {
        //  scrapHeadlines(newsource);
        // });
        callback();
      },
      function(callback) {
        try {
        Updates.insert({
          'ms': Date.now(),
          'date': new Date()
        }, function() {
          console.log("Update done");
          console.log("Errors");
          console.log(error);
          return true;
        });
        }
        catch (e) {
           console.log("Uh-oh, Error!: " + e + "\n using Update callback");
        }
      }
    ]));

    ////////////////////////////////////////////////////////////
    // GET URLS FROM 
    // EACH OF THE DOMAINS
    ////////////////////////////////////////////////////////////

    function scrapHeadlines(newsource) {
      var options = {
        url: newsource.url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Cache-Control': 'max-age=0'
        }
      };
      var mainurl;
      if (newsource.subdomain) {
        mainurl = newsource.url + newsource.subdomain;
       } 
      else {
       mainurl = newsource.url;
      }

      try {
      // Fiber(function() { 
        var result = HTTP.call("GET", mainurl,
                                {headers: {'User-Agent': 'Googlebot/2.1; +http://www.google.com/bot.html'}}
        );

       body = result.content;
        
       async.series([
          function(callback) {
            $ = cheerio.load(body);
            callback();
          },
          function(callback) {
            function geturls (csslist) {
              if (typeof csslist === 'string') {
                console.log(typeof csslist,"here string");
                return $(csslist);
                  }
              if (typeof csslist === 'object') {
                console.log(typeof csslist,"here obj");
                var urllist = [];
                for (var i = 0; i < csslist.length; i++) {
                  $(csslist[i]).each(function(i, elem) {
                    urllist.push(elem);
                  });

                }
                return urllist;
                }
            }


           var resp = geturls(newsource.UrlCssSelector);


            var index = 0;
            console.log('\n \n');
            console.log('@@@@@@@@@@@@@@@@@@@@@@  Starting ', newsource.source, ' @@@@@@@@@@@@@@@@@@@@@@');
            console.log('\n');
            // _.each(resp,function (element, next) {
            //   ObjFromHeadline(element, index, $, newsource);
            // });


            async.eachLimit(resp, concurrency, function(element, next, err) {
              if (err) {
                console.error(err);
              }
              index = +1;
              try {
              ObjFromHeadline(element, index, $, newsource, error);
              }
              catch (e) {
                console.log("Uh-oh, Error!: " + e + "\n using ObjFromHeadline");
              }
              next();
            });

          }
        ]);

        return true;
         // }).run();


      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
          console.log("Uh-oh, ScrapeNexts Error!: " + e + " using " + newsource.url);
          
          error[datems][errindex].url = newsource.url;
          error[datems][errindex].url.type = e;
          error[datems][errindex].url.source = newsource.source;
          errindex =+ 1;
        return false;
        
      }
    }

    function ObjFromHeadline(element, index, $, newsource, error) {
      var initialscore = 10;
      var datenow = new Date();
      var sourceurl = newsource.url;

      // console.log(element);
      // Fiber2(function() { 
      function hastitle (element) {
        var html = $(element).html();
        var $$ = cheerio.load(html); 
        $$('.time').remove();
        $$('.feed_text').remove();
        $$.root().text();
        if($$.root().text()) {
          return $$.root().text().trim();}
          else {
            return "No title available";
          }
        }
      //////////////////////////////////////////////////////  
      // Scoring must take place here  element.attribs.href
      // eg. Comments, Source, Gravity
      ///////////////////////////////////////////////////////     
      var title = hastitle(element); 
      function URLcorrection (url) {
      var correcturl;
      if (url.substring(0, 4) != 'http') {
        correcturl = sourceurl + element.attribs.href;
      } else {
        correcturl = element.attribs.href;
      }
         // ?catid=6&SID=google

      if (correcturl.substring(0, 9) === 'http://m.') {
         correcturl = "http://www." + correcturl.substring(9);
         if ((correcturl.indexOf('?catid') !== -1)) {
            var catid = parseInt(correcturl.substring(correcturl.indexOf('?catid')).match(/\d+/)[0]);
            console.log("catid",catid,typeof(catid));
            correcturl = correcturl.substring(0,correcturl.indexOf('?catid'));
         }
      }


       return correcturl;
      }

     var score = function () {
      if (typeof(catid) === 'number' && catid == 2) {
          return  initialscore + 5 ;
       } else
       return initialscore;
     };
      
      var correcturl = URLcorrection(element.attribs.href);
      console.log(index + ".Title : " + title + '\n' + '  URL : ' + correcturl);
      console.log("");
      
      function Obj() {
        this.type= newsource.type;
        this.commentsfeed= newsource.commentsfeed;
        this.quality= newsource.quality;
        this.score = score();
        this.source= newsource.source;
        this.title= title;
        this.url= correcturl;
        this.submitDate= new Date();
      }

      var obj = new Obj();

      return filePost(obj, newsource);
      // }).run();
    }

    ////////////////////////////////////////////////////////////
    // Check the PoST 
    // Insert/Update
    ////////////////////////////////////////////////////////////
    function filePost(obj, newsource) {
      Fiber(function() {
        findpost = null;
        async.series([
          function(callback) {
            findpost = Posts.findOne({$or: [ {'url': obj.url},{'title':obj.title}]});
            callback();
          },
          function(callback) {
            //   if (obj.commentsfeed && findpost) {
            //   Posts.update({
            //     'url': obj.url
            //   }, {
            //     'CommentsNumber': obj.CommentsNumber
            //   });
            //   console.log("++++ Post exist ? ", !!findpost,"updated? true");

            // } 
            // else 
            if (!findpost) {
              //WE GET THE DATA FROM EACH POST
              async.series([
                function(callback) {
                  extracted = extraxtData(obj, newsource);
                  var fileError ={};
                  if (extracted){
                  fileError.content = (extracted.PostContent === 'ERROR Didnt get content');
                  fileError.url = !extracted.url;
                  fileError.title = !extracted.title;
                  console.log("url error:",fileError.url," title error:",fileError.title," content error:",fileError.content);
                }
                  callback(null,fileError);
                }],
                function(err, fileError) {
                  fileError = fileError[0];
                  if (fileError.content || fileError.url || fileError.title ) {
                     console.log("There was an error I cannot insert"); 
                     console.log("=== === === === === === === === === === === === === === ");
                     console.log('\n');
                     return false;
                   }
                  else {
                    if (extracted) {
                    insertPost(extracted);}
                    }
                });
          
            } else {
              console.log("++++ Post exist ? ", !!findpost);
            }
          }
        ]);


        return;
      }).run();
    }

    function insertPost(obj) {
      ///Prototype - Gravity
        var prop =  {
        datenow: function () {return new Date();},
        timeDiff: function () {return Math.abs(this.datenow().getTime() - Date.parse(this.PostDate));},
        hours : function () { return Math.round(this.timeDiff() / (1000 * 3600));},
        minutes : function () {return Math.round(this.timeDiff() / (1000 * 60));},
        days : function () {return Math.round((this.timeDiff() / (1000 * 3600 * 24)));},
        updatedscore: function() {if (this.commentsfeed) {
               return Math.round(this.score  * (0.8 + (this.CommentsNumber||0) / 30) + parseFloat(this.Min));
             }
          else return this.score + parseFloat(this.Min);
        },
        gravity: function() {return (Math.pow(this.updatedscore()*100,1+(this.quality/10))/Math.pow(Math.ceil(this.hours()+1), gravitylevel[this.type])).toFixed(3);}
        };
        
      var gravitylevel ={'blog':1.4,'news':1.6,'flashnews':1.8};

  
      obj.__proto__ = new Object(prop); 
      obj.gravitylevel= parseFloat(obj.gravity()) || 100;

      // console.log(obj.datenow());
      // console.log(obj.PostDate);

      // console.log(obj.timeDiff());
      // console.log(obj.hours());
      // console.log(obj.updatedscore());
      // console.log(obj.commentsfeed);
      // console.log(obj.CommentsNumber);
      // console.log(obj.score);
      // console.log(obj.quality);
      // console.log(obj.type);
      // console.log(obj.gravity());
      ///Prototype - Gravity

      return Posts.insert(obj, function(err, res) {
        if (err) throw err;
        console.log('entered ',res);

      });

    }

    ////////////////////////////////////////////////////////////
    // GET DATA
    // FROM EACH POST
    ////////////////////////////////////////////////////////////

    function extraxtData(obj,newsource) {
    
    function checks(obj) {
    var rules = [{source:"m.ft.com",word:["cms","2015"]},
                 {source:"MorningStar",word:["articlenet",'xxxxxxx']}
                ];
    var res = true;
     _.each(rules,function (rule) {
      if (obj.source === rule.source) {
        console.log('\n \n');
        console.log('Check rules for url', obj.url);
        console.log('for 1st word in link',rule.word[0]," exist? ",obj.url.indexOf(rule.word[0]!=-1));
        console.log('for 2nd word in link',rule.word[1]," exist? ",obj.url.indexOf(rule.word[1]!=-1));
        console.log('both words dont exist? ', obj.url.indexOf(rule.word[0]) === -1 && obj.url.indexOf(rule.word[1]) === -1);
        if (obj.url.indexOf(rule.word[0]) === -1 && obj.url.indexOf(rule.word[1]) === -1) {
           console.log("+++++Check Error",obj.url);
          res = false;
        }    
       } 
      });
      return res;
      }

    console.log("Check obj",checks(obj));
    if (checks(obj)) {
    try {
        var result = Meteor.http.call('GET', obj.url,
         {
          headers: {
            'User-Agent': 'Googlebot/2.1; +http://www.google.com/bot.html',
            'Cache-Control': 'max-age=0'
          }
        });

        $ = cheerio.load(result.content);
        obj.PostDate = new Date(Date.parse(treatDate(newsource.subDateCssSelector, obj)));
        console.log(getString(newsource.commentCssSelector));
        obj.CommentsNumber = !!(getString(newsource.commentCssSelector).match(/\d+/)) ? treatComments(newsource.commentCssSelector) : 0 ;
        obj.PostContent = getHTML(newsource.contentCssSelector);
        obj.Words = getWords(newsource.contentCssSelector);
        obj.Min = parseFloat((obj.Words.length / 180).toFixed(1));

        console.log('\n \n');
        console.log("======================Start============================");
        console.log('i am inside: ', obj.url);
        console.log("Comments",getString(newsource.commentCssSelector));
        console.log('Date: ', obj.PostDate);
        console.log('\n');
        console.log($(newsource.commentCssSelector).text());
        console.log('Comments: ', obj.CommentsNumber);
        console.log("======================Body============================");
        console.log(obj.PostContent.substring(0, 500));
        console.log("======================End============================");
        console.log('\n \n');
        return obj;

      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
          console.log("Uh-oh, ScrapeNexts Error!: " + e + " using " + obj.url);
          error[datems][errindex] = {};
          error[datems][errindex].url = obj.url;
          error[datems][errindex].url.type = e;
          error[datems][errindex].url.source = obj.source;
          errindex =+ 1;
        return false;
        
      }
      } 
      }

    //Helper
    function countWords(str) {
      return str.split(/\s+/).length;
    }

    function getWords(node) {
      $(node);
      var paragraphs = [];
      $('p, div').each(function(i, elem) {
        paragraphs[i] = $(this).text();
      });

      var wordsstr = paragraphs.join();

      var words = wordsstr.split(/\W+/);
      return words;
    }

    function treatContent(html) {
      $ = cheerio.load(html);
      $('.page-title').remove();
      $('.related-links-container').remove();
      $('.pattern__meta').remove();
      $('.content-extras').remove();
      $('.popular-video').remove();
      $('.feed-footer-wrapper').remove();
      $('.source').remove();
      $('.caption').remove();
      $('.v_playerwrap').remove();
      $('.aadsection_a1').remove();
      $('.storyvideo').remove();
      $('.shareArt').remove();
      $('.sharedaddy').remove();
      $('.main-content-container').remove();
      $('.commentlist').remove();
      $('.promobox').remove();
      $('div.pager').remove();
      $('#respond').remove();
      $('#comments').remove();
      $('.credit').remove();
      $('.comment-disclaimer').remove();
      $('img').attr('style', 'max-width:100%; height: initial;');
      $('div').attr('style', 'max-width:100%');
      return $.html();
    }

    function treatDate(node, obj) {
      var datenow = new Date();
      var str = getString(node);
      if (obj.source == 'MorningStar') {
       str = str.substring(str.search(/\d/));
      } 
      else {
        str = str.substring(str.indexOf('-') + 1);
      }
      if (obj.source == 'Greenbackd') {
        str = str.substring(0, str.indexOf('by'));
      }
      console.log(str);
      str = str.replace(/th|st|nd|rd|at|AM|am|pm|PM|by|Guest|Author|Tobias|Carlisle|Email|Article|\||\r|\n|\./g, "").replace(/\s+/, " ");
      str = str.trim();
      if (!isNaN(Date.parse(str)) && Date.parse(str)> 1400004654180) {return str;} 
      console.log('Before year ',Date.parse(str),str);
      if (str && str.indexOf('-') != -1) { str = chkyear(str);}
      if (!isNaN(Date.parse(str)) && Date.parse(str)> 1400004654180) {return str;} 

        if (str) {
          if (str.match(/\d+/g).length === 1) {
            console.log("dddd");
            str = str + " " + datenow.getFullYear();
            return str;
          }
        var year = null;
        for (var i = 0; i < str.match(/\d+/g).length; i++) {
          console.log(str.match(/\d+/g)[i].length);
          if (str.match(/\d+/g)[i].length === 4) {
            year = str.match(/\d+/g)[i];
          }
        }
        if (!year) {
          str = str + " " + datenow.getFullYear();
        }
        console.log(str);
      }
      return str;
    }

    function chkyear (str){
      var year= str.split('-')[2];
      console.log(str.split('-')[2].substring(0,2));
      if (str.split('-')[2].substring(0,2)!=="20" ) {
        str = str.split('-');
        str[2]= "20"+year;
        str = str.join("-");
      }
      return str;
    }

    function treatComments (node){

      var str = getString(node);
      console.log("comments inside",str);
      if (str.search("of")) {str = str.substring(str.search("of"+2));}
      return str.match(/\d+/)[0] ;

    } 

    function getHTML(csslist) {
       var html;
      if (typeof csslist === 'string' && !!($(csslist).html())) {
         html = $(csslist).html();
        return treatContent(html);
      }
      if (typeof csslist === 'object') {
        for (var i = 0; i < csslist.length; i++) {
          console.log($(csslist[i]).html());
          if (!!$(csslist[i]).html()) {
             html = $(csslist[i]).html();
          return treatContent(html);
          }
        }
      }
      console.log("3");
      return "ERROR Didnt get content";
    }

    function getString(csslist) {
      if (typeof csslist === 'string' && !!($(csslist).text())) {
        return $(csslist).length === 1 ? $(csslist).text() : $($(csslist)[0]).text();
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
  ////////////////////////////////////////////////////////////
  // screaping method end  
  },

  getlastupdate: function() {
    var lastupdate = Updates.findOne({}, {
      sort: {
        ms: -1
      }
    });
    return lastupdate.ms;
  },

  cleanagent: function() {
    // Posts._ensureIndex({
    //   title: 1
    // }, {
    //   unique: true,
    //   dropDups: true
    // }, 
    // function () {return true;});

    // Posts._ensureIndex({
    //   url: 1
    // }, {
    //   unique: true,
    //   dropDups: true
    // });

  Posts.remove( { url: {$exists: false} } );
  
  },
  updateGrav: function(posts) {
    this.unblock();
    _.each(posts,function(post){
      var prop =  {
        datenow: function () {return new Date();},
        timeDiff: function () {return Math.abs(this.datenow().getTime() - Date.parse(this.PostDate));},
        hours : function () { return Math.round(this.timeDiff() / (1000 * 3600));},
        minutes : function () {return Math.round(this.timeDiff() / (1000 * 60));},
        days : function () {return Math.round((this.timeDiff() / (1000 * 3600 * 24)));},
        updatedscore: function() { 
          if (this.commentsfeed) {
            return Math.round(this.score  * (0.8 + this.CommentsNumber/ 30) + parseFloat(this.Min));
          }
        else 
          return this.score + parseFloat(this.Min);
          },
        gravity: function() {return (Math.pow(this.updatedscore(),1+(this.quality/10))/Math.pow(Math.ceil(this.hours()/5+1), gravitylevel[this.type])).toFixed(3);}
        };
      var gravitylevel ={'blog':1.2,'news':1.6,'flashnews':1.8};
      post.__proto__  = new Object(prop);
      try {
       Posts.update({_id:post._id},{$set:{gravitylevel:parseFloat(post.gravity())}}, function(){
        // console.log(post.gravitylevel,post.gravity(),parseFloat(post.gravity()));
        // console.log(post.updatedscore());
        // console.log(post.hours());
       });
      } catch (e) {
         console.log("Uh-oh, Error!: " + e +" in Gravity update");
       }
    });
  },
  cleanPosts: function() {
    var removeObj = {
      // 'source': 'abnormalreturns.com/'
    };

    Posts.remove(removeObj, function(result, error) {
      if (error) {
        console.log(error);
      } else
        console.log('removed' + result);
    });
  },
  upPost : function(id) { 
    this.unblock();
    Posts.update({_id:id},{ $inc: { score: +1}});
  },
  downPost : function(id) { 
    this.unblock();
    Posts.update({_id:id},{ $inc: { score: -1}});
  },
  findposts: function(search,options) {
   return Posts.find(search,options).fetch();
  }
});