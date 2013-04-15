
/**
 * Module dependencies.
 */

var express = require('express')
  , models = require('./models')
  , mc = require('./microcommunity')  
  
//app setup and configuration
var app = express()

var basic = require('./lib/basic')
var auth = require('./lib/auth')
var utils = require('./lib/utils')

app.configure(function(){

  //a middleware for rendering pages while passing js data to the client
  app.use(function(req, res, next){
		res.loadPage = function (app, data){
			res.render(app, { 
				server : {
					appName: app,
					data: data || {},
					currentUser: req.user,
					itemModulesInfo : mc.exportItemsModulesForClient()
				}
			})
		}	
		next()
	})	

	//microcommunity modules
	app.use(auth) //should be used first	
	app.use(basic)
	
  //microcommunity util module 
  app.use(utils.test)	
	
	//express modules
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/templates')
  app.set('view engine', 'jade')
  app.use(express.favicon())
  app.use(express.logger('dev')) 
  app.use(app.router)  
  app.use(express.static(__dirname + '/static'))
  app.use('/client', express.static('client-built'))     
  app.use('/client', express.static('client'))   
})

app.configure('development', function(){
  app.use(express.errorHandler());
})

app = app.listen(3000)

