require({
  paths: {
    cs: 'cs',
    'coffee-script': 'coffee-script',
    jquery : 'lib/jquery.min',
    backbone : 'lib/backbone.min',
    underscore: 'lib/underscore.min',
    bootstrap: 'lib/bootstrap.min',
    'jquery.gravatar': 'lib/jquery.gravatar',
    'jquery.spin': 'lib/jquery.spin',
    'spin': 'lib/spin.min',
    'md5' : 'lib/md5',
    'general' : 'lib/general',
    'moment' : 'lib/moment.min',
    'diff' : 'lib/diff'
  },
  
  shim: {
  	'backbone' : {
  		deps: ["underscore", "jquery"],
  		exports: "Backbone"
  	}, 
  	'underscore' : {
  		exports : "_"
  	},  
  	'jquery' : {
  		exports : 'jQuery'
  	},
  	
  	'jquery.gravatar' : ['jquery', 'md5'],
  	'jquery.spin' : ['jquery', 'spin'],
  	'md5' : [],
  	'general' : [],
  	'moment' : [],
  	'diff' : [],

  	'bootstrap' : {
  		exports: ''
  	}  	
  	
  }
  
}, ['cs!csmain']);
