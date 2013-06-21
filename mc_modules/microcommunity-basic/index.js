var microcommunity = require('microcommunity')
	, mongoose = require('mongoose')
	
require('./models/post')
require('./models/photo')
	
var Stream = mongoose.model('Stream')
	, User = mongoose.model('User')
	, Wall = mongoose.model('Wall')
	, Stream = mongoose.model('Stream')
	, Post = mongoose.model('Post')
	, Photo = mongoose.model('Photo')
	, Container = mongoose.model('Container')
	, auth = microcommunity.auth


microcommunity.registerPlugin(__dirname)

module.exports = function(){

	var app = module.exports = microcommunity.plugin(__dirname)

	function someMaterialsSidebar(req, res, next){
		Container.find({ containerType : 'material' }).limit(5).exec(function(err, materials){	
			var links = []
			for(var i=0; i<materials.length; i++){
				var material = materials[i]
				var link = { label : material.name , url : '/materials/'+material.id }
				links.push(link)
			}		
			res.sidebars.pushSidebar('Materials', links)
			next()	
		})
	}

	//main app
	app.get('/', someMaterialsSidebar, function(req, res){
		Stream.globalStream(function(err, items){
			res.loadPage('home', { 
				items : items 
			})
		})	
	})

	//profile app
	app.get('/profiles/:id', someMaterialsSidebar, function(req, res){	
		var id = req.params.id	
		User.findById(id, function(err, user){
			Wall.loadItems(user.wall, function(err, items){	
				res.loadPage('profile', {
					user : user, 
					items : items
				})
			})			
		})	
	})

	//publisher api
	app.post('/api/walls/user/post', function(req, res){	
		User.findById(req.body.author, function(err, author){
			var post = new Post({
				content : req.body.content,
				wall : req.body.wall,
				walls : [req.body.wall],
				author : author.id,		
				streams : [author.stream]
			})	
			post.save(function(err){
				res.send(post)
			})		
		})
	})

	//api
	app.post('/api/walls/user/photo', auth.ensureAuthenticated, function(req, res){
		var photo = new Photo({
			content : req.body.content,
			author : req.body.author,
			wall : req.body.wall,
			streams : [req.user.stream]		
		})
		photo.save(function(err){
			Photo.findById(photo.id, function(){
				res.send(photo)						
			})	
		})	
	})
	
	app.post('/api/items/:item/comments' , function(req, res){
		
		
		var comment = req.body
		comment.published = Date()
		
		var Item = microcommunity.model('Item')
		Item.findById(req.params.item, function(err, item){
			var dbref = item.object	
			var modelName = microcommunity.models.convert(dbref.namespace, 'collection', 'model')
			var Model = microcommunity.model(modelName)
			
			var update = { $push : { comments : comment } }
			var options = { select : 'comments' }
			Model.findByIdAndUpdate(dbref.oid, update, options, function(err, object){
				var l = object.comments.length
				var comment = object.comments[l-1]
				res.send(comment)			
			})
			
			/*Model.findById(dbref.oid, function(err, object){
				object.comments.push(comment)
				object.save(function(err, object){
					console.log(object.comments)
					res.send(200, object.comments[object.comments.length-1])					
				})
			})*/	
								
		})

		
		
	})
	
	
	return app
}

