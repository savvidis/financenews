Meteor.startup(function () {
 var cheerio = Meteor.npmRequire('cheerio');


 Meteor.methods({
  getHeadlines : function (argument) {

    var sources = [
    {source:'efinancialnews',url:'http://www.efinancialnews.com',cssSelector:'#most-read-content > ul > li > h4 > a:nth-child(2)'},
    {source:'economist',url:'http://www.economist.com',cssSelector:'#latest-updates > article > p > a'},
 // {source:'ft.com',url:'http://www.ft.com/home/uk',cssSelector: '.railLinks a'},
 {source:'ft.com',url:'http://www.ft.com/home/europe',cssSelector: '.ft-list-item > a'}
 ];
 var list = [];
 var scrapHeadlines = function (newsource) {
  var result =  Meteor.http.call('GET',newsource.url, {headers: {'User-Agent': 'Mozilla/5.0 (iPad; U; CPU OS 3_2_1 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Mobile/7B405'}});
  $ = cheerio.load(result.content);    
  var resp = $(newsource.cssSelector);
  var Newslist= [];
  var obj ={};
  var sourceurl = newsource.url;
  resp.each(function (i,element) {
    var title = $(element).text(); 
    var correcturl;
    if (element.attribs.href.substring(0,4) != 'http') {
      correcturl = sourceurl + element.attribs.href; }
      else 
        { correcturl = element.attribs.href;}
      console.log(title + '---' + element.attribs.href);

      obj  = {'source':newsource.source,'title': title,'url':correcturl};
      if (!Posts.findOne({'title':obj.title })){
        Posts.insert({'source':newsource.source,'title': title,'url':correcturl}, function() {
          console.log('entered');
        });
      }

      Newslist.push(obj);
    });
  return Newslist; 
};

sources.map(function(element) {
 list = list.concat(scrapHeadlines(element));
});
console.log(list);
return list;

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

});







 // 'http://www.economist.com/') '#latest-updates > article > p > a');

// http://www.ft.com/home/uk