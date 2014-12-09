Router.configure({
  layoutTemplate: 'mainLayout',
  loadingTemplate: 'loading',

  yieldTemplates: {
    header: {
      to: 'header'
    },
    footer: {
      to: 'footer'
    }
  },

  onAfterAction: function() {
    $(document).scrollTop(0);
  }
});

Router.onBeforeAction('loading');

Router.map(function () {
	this.route('home', { 
		path:'/'
	});
	this.route('comments', { 
		path:'/:_id'
	});	
});