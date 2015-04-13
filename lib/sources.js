sources = [
 // #inner-content > div.view.view-newsflash-pages-after-main.view-id-newsflash_pages_after_main.view-display-id-page_1.view-dom-id-1 > div.view-content > div.views-row.views-row-3.views-row-odd > div > span > div > h2 > a
 //http://alephblog.com/
  //http://thebanker.com/   Login 3 free articles
  //http://foreignaffairs.com/ Login 3 free articles
  //Infrastructureinvestor.com Login 3 free articles
 //http://whynationsfail.com/ 
 //  {
 // 	type:'news',
 //		quality:2, 	
 // 	source:'zerohedge.com',
 // 	url:'http://www.zerohedge.com/news',
 // 	UrlCssSelector: '.view-most-popular-posts-today > .view-content > .views-row > div > span > a',
 // 	subDateCssSelector:" .submitted > a",
 // 	commentCssSelector: "",
 // 	contentCssSelector:'#inner-content'
 // },
 // {
 // 	type:'news',
 //		quality:2, 	
 // 	source:'efinancialnews',
 // 	url:'http://www.efinancialnews.com',
 // 	UrlCssSelector:'#most-read-content > ul > li > h4 > a:nth-child(2)',
 // 	subDateCssSelector:"#story > div.top > div.head > div.header",
 // 	commentCssSelector:"",
 // 	contentCssSelector:".story"
 // },
  // FULL JAVASCRIPT   
 // {  
 //   type:'blog',
 //  quality:3,   
 //   source:'The aleph blog',
 //   url:'http://alephblog.com/',
 //   UrlCssSelector:'h2.entry-title > a',
 //   subDateCssSelector:".post-date",
 //   commentCssSelector:"",
 //   contentCssSelector:".entry-content"
 // },
 // Google redirect
  //  {
 //   type:'flashnews',
 //  quality:3,
 //   source:'Wall Street Jsournal',
 //   url:'http://www.wsj.com/europe',
 //   UrlCssSelector:'.tipTarget > a',
 //   subDateCssSelector:"#wsj-article-wrap > div.clearfix.byline-wrap > time",
 //   commentCssSelector:"#wsj-article-wrap > div.clearfix.byline-wrap > div.comments-count-container > a",
 //   contentCssSelector:"#wsj-article-wrap"
 // },
 {
 	type:'news',
 	quality:3, 	
 	source:'The Economist',
 	url:'http://www.economist.com',
 	UrlCssSelector:'#latest-updates > article > p > a',
 	subDateCssSelector:"time",
 	commentsfeed:1,
 	commentCssSelector:"#column-right .view-comments",
 	contentCssSelector:"div.main-content",
 	removeCssSelectors:[]
 },
 {
  type:'news',
  quality:3,    
  source:'stratfor.com',
  url:'https://www.stratfor.com',
  subdomain:'/analysis',
  UrlCssSelector: 'article.teaser > div.teaser__right > h3 > a',
  subDateCssSelector:"time",
  commentsfeed:0,
  commentCssSelector:"",
  contentCssSelector:".block-main > .content"

},
 {
 	type:'blog',
 	quality:4,
 	source:'creditbubblestocks',
 	url:'http://www.creditbubblestocks.com',
 	UrlCssSelector:'div.post > h3 > a',
 	subDateCssSelector:"div.blog-posts.hfeed > div > h2 > span",
 	commentsfeed:1,
 	commentCssSelector:"#comments > h4",
 	contentCssSelector:'div.post > div.post-body'
 },
 {
 	type:'blog',
 	quality:4,
 	source:'Viennacapitalist',
 	url:'http://viennacapitalist.com/',
 	UrlCssSelector:'article.post > a',
 	subDateCssSelector:"span.on-date > a > time",
 	commentsfeed:1,
 	commentCssSelector:"#comments > h2", 
 	contentCssSelector:'.post > div.entry-content'
 },
 {
  type:'blog',
  quality:1,
  source:'Greenbackd',
  url:'http://greenbackd.com/',
  UrlCssSelector:'.post > .posttitle > h2 > a',
  subDateCssSelector:"p.post-info",
  commentsfeed:1,
  commentCssSelector:"#comments", 
  contentCssSelector:'.post > div.entry'
 },
 {
 	type:'news',
  quality:1,	
 	source:'Wonkblog',
 	url:'http://www.washingtonpost.com/blogs/wonkblog/wp/category/economy-2/',
 	UrlCssSelector:'.story-headline > h3 > a',
 	subDateCssSelector:"span.pb-timestamp",
 	commentsfeed:0,
 	commentCssSelector:".pb-comment-wrapper > .comment-summary .comment-summary-count > .comments",
 	contentCssSelector:"article"
 },
 {
 	type:'blog',
 	quality:3,
 	source:'y0ungmoney',
 	url:'http://y0ungmoney.blogspot.gr/',
 	UrlCssSelector:'div.post > h3 > a',
 	subDateCssSelector:".date-header",
 	commentsfeed:1,
 	commentCssSelector:"#comments > h4",
 	contentCssSelector:".post > div.entry-content"
 },
  {
 	type:'blog',
 	quality:2,
 	source:'The big Picture',
 	url:'http://www.ritholtz.com/blog/',
 	UrlCssSelector:'div.post > .headline > h2 > a',
 	subDateCssSelector:".byline",
 	commentsfeed:1,
 	commentCssSelector:"#comments",
 	contentCssSelector:".post-content"
 	
 },
 {
  type:'flashnews',
  quality:3,    
  source:'Bloomberg',
  url:'http://www.bloomberg.com/',
  subdomain:'',
  UrlCssSelector: ['article.hero-story > div > h1 > a','article.feed-item > h1 > a'],
  subDateCssSelector:"time",
  commentsfeed:1,
  commentCssSelector:".comment_count",
  contentCssSelector:[".article-body",".article_content"]
 },
 {
 	type:'flashnews',
 	quality:4, 		
 	source:'ft.com',
 	url:'http://www.ft.com/home/europe',
 	UrlCssSelector: '.article > .ft-title > a',
 	subDateCssSelector:"span.time",
 	commentsfeed:0,
 	commentCssSelector:".comment-header",
 	contentCssSelector:['#storyContent','.entry-content']
 },
  {
  type:'flashnews',
  quality:2,    
  source:'m.ft.com',
  url:'http://m.ft.com',
  UrlCssSelector: 'li > a',
  subDateCssSelector:"span.time",
  commentsfeed:0,
  commentCssSelector:".comment-header",
  contentCssSelector:['#storyContent','.entry-content']
 },
  {
 	type:'blog',
  quality:5, 		
 	source:'ft.com/lex',
 	url:'http://www.ft.com/intl/lex',
 	UrlCssSelector: '.article > .ft-title > a',
 	subDateCssSelector:["span.time","span.entry-date"],
 	commentsfeed:0,
 	commentCssSelector:".comment-header",
 	contentCssSelector:['#storyContent','.entry-content']
 },
  {
 	type:'flashnews',
 	quality:2, 	
 	source:'abnormalreturns.com',
 	url:'http://abnormalreturns.com/',
 	UrlCssSelector: 'article.status-publish > a',
 	subDateCssSelector:"header.article-title > p.date",
 	commentsfeed:0,
 	commentCssSelector:"",
 	contentCssSelector:'#main > article > section'
 },
 {
  type:'flashnews',
  quality:1,  
  source:'Business Insider',
  url:'http://www.businessinsider.com/clusterstock',
  UrlCssSelector:['.river > .bigpicture > h2> a','.river-post > h3 > a'],
  subDateCssSelector:".list-pipes > ul > li.date",
  commentsfeed:1,
  pageviewsCssSelector: "div.post-top > div.flex.byline > div.flex-item > div:nth-child(2) > ul > li.pageviews > span",
  commentCssSelector:".list-pipes > ul > .ks-read-comments-top > .comment_count",
  contentCssSelector:".post-content"
 },
 {
  type:'news',
  quality:3,  
  source:'MorningStar',
  url:'http://www.morningstar.com/',
  UrlCssSelector:'.level-3 .editorial-link-list >li > a',
  subDateCssSelector:'#mstarArticleBasicInfo',
  commentsfeed:1,
  pageviewsCssSelector: "",
  commentCssSelector:"#commentPaging",
  contentCssSelector:"#mstarContent"
 }

 ];