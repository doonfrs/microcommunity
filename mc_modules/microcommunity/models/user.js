var mongoose = require('mongoose')
	, hasWall = require('./plugins/has-wall')
	, hasStream = require('./plugins/has-stream')
	, _ = require('underscore')

var userSchema = new mongoose.Schema({
	displayName: String,
	password : String,
	email : String,
	openId : String,
	role : String,
	follows : [{ type : mongoose.Schema.Types.ObjectId }]
})

userSchema.statics.findByEmail = function(email, callback){
	this.model('User').findOne({ email : email }, function(err, user){
		callback(err, user)
	})
}

userSchema.methods.follow = function(object){
	//var f = _.find(this.follows, function(follow){ return ( follow.toString() === object.stream.toString() ) })
	//if (!f){
		this.follows.push(object.stream)
	//}
}

userSchema.methods.loadFeed = function(callback){
	var mc = require('microcommunity')
		, Item = mc.model('Item')
	Item.fetchItems({ streams : { $in : this.follows } }, callback)
}

userSchema.pre('save', function(next){
	if (this.isNew){
		var mc = require('microcommunity')
		this.role = mc.site.defaultRole
		next()
	}
	next()
})


userSchema.plugin(hasWall, { displayNameAttribute : 'displayName', wallType : 'user' })
userSchema.plugin(hasStream)

module.exports = userSchema



