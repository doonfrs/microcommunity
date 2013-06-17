var util = require('util')
	, EventEmitter = require('events').EventEmitter
	, mongoose = require('mongoose')
	, _ = require('underscore')
	, async = require('async')

function Models(){}
util.inherits(Models, EventEmitter)

//private members

var registery = []

var index = {
	objects : {},
	collections : {},
	models : {}
}

//private moethods
function registerModel(hash){
	var field = {
		object : hash.object,
		collection : hash.collection,
		model : hash.model 
	}	
	var i = registery.push(field) - 1
	
	index.objects[field.object] = i
	index.collections[field.collection] = i
	index.models[field.model] = i	
}

function validate(str){
	return (str ==  'object' || str == 'collection' || str == 'model')
}

//public methods
Models.prototype.convert = function(string, from, to){
	if (validate(from) && validate(to)){
		from = from + 's'
		var i = index[from][string]
		return registery[i][to]	
	} else return 
}

Models.prototype.define = function(modelName, objectType, collectionName, schema){

	//configuration and creation of the mongoose model
	schema.virtual('objectType').get(function(){ return objectType })	
	schema.set('toJSON', { virtuals: true })
	var Model = mongoose.model(modelName, schema, collectionName)	
	
	//registering the model meta data
	registerModel({
		model : modelName, 
		object : objectType, 
		collection : collectionName
	})
	
	return Model	
}

Models.prototype.getModel = function(modelName){
	return mongoose.model(modelName)
}

Models.prototype.start = function(){
	mongoose.connect('mongodb://localhost/test')
}

Models.prototype.initialize = function(){

	//exporting plugins
	var hasStream = require('./models/plugins/has-stream')		
	var hasWall = require('./models/plugins/has-wall')		
	var isItem = require('./models/plugins/is-item')		
	var isContainer = require('./models/plugins/is-container')	
	var isContent = require('./models/plugins/is-content')			

	models.plugins = {
		hasStream : hasStream,
		hasWall : hasWall,
		isItem : isItem,
		isContainer : isContainer,
		isContent : isContent
	}
	
	//defining default models
	var streamSchema = require('./models/stream')
	var wallSchema = require('./models/wall')
	var itemSchema = require('./models/item')
	var userSchema = require('./models/user')
	var containerSchema = require('./models/container')

	models.define('Stream', 'stream', 'streams', streamSchema)
	models.define('Wall', 'wall', 'walls', wallSchema)
	models.define('Item', 'item', 'items', itemSchema)
	models.define('User', 'user', 'users', userSchema)
	models.define('Container', 'container', 'containers', containerSchema)	

}

var models = new Models()

//exporting final object
module.exports = models

models.start()

