var mongoose = require('mongoose')
	, models = require('./index')
	, itemable = require('./itemable')

var postSchema = new mongoose.Schema({
	content: String
})

postSchema.virtual('objectType').get(function(){ return 'post' })

postSchema.plugin(itemable)

var Post = mongoose.model('Post', postSchema);



