var mongoose = require('mongoose')
	, models = require('microcommunity').models
	, hasWall = models.plugins.hasWall
	, hasStream = models.plugins.hasStream	
	, isContent = models.plugins.isContent				
	
var wikipageSchema = new mongoose.Schema({
	title: String,
	content : String
})

wikipageSchema.plugin(hasWall, { displayNameAttribute : 'title', wallType : 'wikipage' })
wikipageSchema.plugin(hasStream)
wikipageSchema.plugin(isContent)

module.exports = wikipageSchema
