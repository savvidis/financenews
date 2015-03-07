Meteor.startup(function() {
  request = Meteor.npmRequire('request');
  async = Meteor.npmRequire('async');
  cheerio = Meteor.npmRequire('cheerio');

});


Meteor.methods({
  getHeadlines: function(argument) {
    var concurrency = 5;
    var Fiber2 = Meteor.npmRequire('fibers');
    var Fiber =  Meteor.npmRequire('fibers');

    var list = [];
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
        Updates.insert({
          'ms': Date.now(),
          'date': new Date()
        }, function() {
          console.log("Update done");
          return true;
        });
      }
    ]);

    // GET URLS FROM 
    // EACH OF THE DOMAINS
    // --------------

    function scrapHeadlines(newsource) {
      var options = {
        url: newsource.url,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Cache-Control': 'max-age=0'
        }
      };
    

      try {
      // Fiber(function() { 
        var result = HTTP.call("GET", newsource.url,
                                {headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}}
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
              ObjFromHeadline(element, index, $, newsource);
              next();
            });

          }
        ]);

        return true;
         // }).run();


      } catch (e) {
        // Got a network error, time-out or HTTP error in the 400 or 500 range.
          console.log("Uh-oh, ScrapeNexts Error!: " + e + " using " + newsource.url);
        return false;
        
      }
    }

    function ObjFromHeadline(element, index, $, newsource) {
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
      // Scoring must take place here  element.attribs.href
      // eg. Comments, Source, Gravity     
      var title = hastitle(element); 
      function URLcorrection (url) {
      var correcturl;
      if (url.substring(0, 4) != 'http') {
        correcturl = sourceurl + element.attribs.href;
      } else {
        correcturl = element.attribs.href;
      }

      if (correcturl.substring(0, 9) === 'http://m.') {
         correcturl = "http://www." + correcturl.substring(9);
      }
       return correcturl;
      }
      var correcturl = URLcorrection(element.attribs.href);
      console.log(index + ".Title : " + title + '\n' + '  URL : ' + correcturl);
      console.log("");
      var obj = {
        'type': newsource.type,
        'commentsfeed': newsource.commentsfeed,
        'quality': newsource.quality,
        'score': initialscore,
        'source': newsource.source,
        'title': title,
        'url': correcturl,
        'submitDate': datenow
      };
      return filePost(obj, newsource);
      // }).run();
    }

    // Check the PoST 
    // Insert/Update
    // --------------

    function filePost(obj, newsource) {
      Fiber2(function() {
        findpost = null;
        async.series([
          function(callback) {
            findpost = Posts.findOne({$or: [ {'url': obj.url},{'title':obj.title}] 
            });
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
                  var error ={};
                  error.content = (extracted.PostContent === 'ERROR Didnt get content');
                  error.url = !extracted.url;
                  error.title = !extracted.title;
                  console.log("url error:",error.url," title error:",error.title," content error:",error.content);
                  callback(null,error);
                }],
                function(err,error) {
                  error = error[0];
                  if (error.content || error.url || error.title ) {
                     console.log("There was an error I cannot insert"); 
                     console.log("=== === === === === === === === === === === === === === ");
                     console.log('\n');
                     return false;
                   }
                  else {
                    insertPost(extracted);}

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
      return Posts.insert(obj, function(err, res) {
        if (err) throw err;
        console.log('entered ',res);

      });

    }

    // GET DATA
    // FROM EACH POST
    // --------------

    function extraxtData(obj, newsource) {
       
    try {
        var result = Meteor.http.call('GET', obj.url,
         {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Cache-Control': 'max-age=0'
          }
        });

        $ = cheerio.load(result.content);
        obj.PostDate = new Date(Date.parse(treatDate(newsource.subDateCssSelector, obj)));
        console.log(getString(newsource.commentCssSelector));
        obj.CommentsNumber = !!(getString(newsource.commentCssSelector).match(/\d+/)) ? getString(newsource.commentCssSelector).replace('One', 1).match(/\d+/)[0] : "";
        obj.PostContent = getHTML(newsource.contentCssSelector);
        obj.Words = getWords(newsource.contentCssSelector);
        obj.Min = (obj.Words.length / 180).toFixed(1);

        console.log('\n \n');
        console.log("======================Start============================");
        console.log('i am inside: ', obj.url);
        console.log($(newsource.subDateCssSelector).text());
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
          console.log("Uh-oh, ScrapeNexts Error!: " + e + " using " + newsource.url);
        return false;
        
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

      $('.related-links-container').remove();
      $('.popular-video').remove();
      $('.feed-footer-wrapper').remove();
      $('.source').remove();
      $('.caption').remove();

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
      str = str.substring(str.indexOf('-') + 1);
      if (obj.source == 'Greenbackd') {
        str = str.substring(0, str.indexOf('by'));
      }
      console.log(str);
      str = str.replace(/th|st|nd|rd|at|AM|am|pm|PM|by|Guest|Author|Tobias|Carlisle|\./g, "");
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

    function treatComments(node) {
      if (typeof csslist === 'object' && csslist !== null) {
        return node[0];
      }
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
    Posts._ensureIndex({
      title: 1
    }, {
      unique: true,
      dropDups: true
    }, function () {return true;});

    Posts._ensureIndex({
      url: 1
    }, {
      unique: true,
      dropDups: true
    });

    Posts.remove( { url: {$exists: false} } );
  },
  updat: function() {
    
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
  }
});