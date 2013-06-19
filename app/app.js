var microcommunity = require('microcommunity')
	, basic = require('microcommunity-basic')
	, wikipagesPlugin = require('microcommunity-wikipages')
	, filesPlugin = require('microcommunity-files')
	, auth = require('microcommunity').auth	

//registering models
var materialSchema = require('./models/material')	
microcommunity.models.define('Material', 'material', 'containers', materialSchema)
	
//creating and setting up the app	
var app = microcommunity.createApplication(__dirname)	

//routes
var routes = require('./materials-routes')
app.get('/materials/new', routes.new)	
app.post('/materials', routes.create)
app.get('/materials/:container/members', routes.members)	
app.get('/materials/:container/settings',	auth.ensureAuthenticated, auth.ensureContainerAdmin(), routes.settings)
app.get('/materials/:container', routes.show)
app.get('/materials/:container/wall', routes.wall)
app.get('/materials/:container/stream', routes.stream)
app.get('/materials', routes.index)

//api
var api = require('./api')
api(app)

//using external plugins
//using wikipages plugin
app.use(wikipagesPlugin({ containersPath : '/materials' }))
//using file plugin
app.use(filesPlugin({ containersPath : '/materials' }))
//using basic app
app.use(basic)

app.listen(3000)

