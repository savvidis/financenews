sources = [
 {
 	type:'news',
 	source:'efinancialnews',
 	url:'http://www.efinancialnews.com',
 	UrlCssSelector:'#most-read-content > ul > li > h4 > a:nth-child(2)',
 	subDateCssSelector:"#story > div.top > div.head > div.header",
 	commentCssSelector:"",
 	contentCssSelector:".story"
 },
 {
 	type:'news',
 	source:'economist',
 	url:'http://www.economist.com',
 	UrlCssSelector:'#latest-updates > article > p > a',
 	subDateCssSelector:"#column-content > aside > time",
 	commentCssSelector:"#column-right .view-comments",
 	contentCssSelector:"div.main-content"
 },
 {
 	type:'blog',
 	source:'creditbubblestocks',
 	url:'http://www.creditbubblestocks.com',
 	UrlCssSelector:'div.post > h3 > a',
 	subDateCssSelector:"div.blog-posts.hfeed > div > h2 > span",
 	commentCssSelector:"#comments > h4",
 	contentCssSelector:'div.post > div.post-body'
 },
 {
 	type:'blog',
 	source:'viennacapitalist',
 	url:'http://viennacapitalist.com/',
 	UrlCssSelector:'article.post > a',
 	subDateCssSelector:"span.on-date > a > time",
 	commentCssSelector:"#comments > h2", 
 	contentCssSelector:'.post > div.entry-content'
 },
 {
 	type:'blog',
 	source:'y0ungmoney',
 	url:'http://y0ungmoney.blogspot.gr/',
 	UrlCssSelector:'div.post > h3 > a',
 	subDateCssSelector:"h2.date-header > span",
 	commentCssSelector:"#comments > h4",
 	contentCssSelector:".post > div.entry-content"
 },
 {
 	type:'flashnews',
 	source:'ft.com',
 	url:'http://www.ft.com/home/europe',
 	UrlCssSelector: '.ft-list-item > a',
 	subDateCssSelector:"span.time",
 	commentCssSelector:"",
 	contentCssSelector:'#storyContent'
 }
 ];