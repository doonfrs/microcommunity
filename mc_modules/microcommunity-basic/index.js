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
	, can = microcommunity.can

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
	
		if (!req.user){
			res.sidebars.disable()
			res.loadPage('welcome')		
		} else {
		
			//req.user.loadFeed(function(err, items){
			Stream.globalStream(function(err, items){	
				can.authorizeItems(items, req.user, function(err, items){
					if (req.user){
						var currentUser = req.user //just a small hack
						req.user = req.user.toJSON()
						can.authorize(req.user.wall, 'wall', 'publish', currentUser, function(err, wall){
							res.loadPage('home', { 
								items : items 
							})				
						})				
					} else {
						res.loadPage('home', { 
							items : items 
						})			
					}			
				})				
			})		
		}	
	})

	//profile app
	app.get('/profiles/:id', someMaterialsSidebar, function(req, res){	
		var id = req.params.id	
		User.findById(id, function(err, user){
			Wall.loadItems(user.wall, function(err, items){		
				var authorizedUser = user.toJSON()		
				can.authorize(authorizedUser.wall, 'wall', 'publish', req.user, function(err, wall){
					res.loadPage('profile', {
						user : authorizedUser, 
						items : items
					})			
				})
			})			
		})	
	})
	
	app.post('/users/:id/follow', function(req, res){
		User.findById(req.params.id, function(err, user){
			req.user.follow(user)
			req.user.save(function(err){
				res.redirect('back')			
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
				can.authorize(post.toJSON(), 'item', 'comment', req.user, function(err, post){
					res.send(post)
				})				
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
	
	function fetchItem(req, res, next){
		var Item = microcommunity.model('Item')
		Item.findById(req.params.item, function(err, item){	
			req.item = item
			next()
		})		
	}	
	
	var middleware = can.authorizeMiddlewareAPI('item', 'comment')
	
	app.post('/api/items/:item/comments', function(req, res){	
		var comment = req.body
		comment.published = Date()
				
		var Post = microcommunity.model('Post')

		var update = { $push : { comments : comment } }
		var options = { select : 'comments' }
		Post.findByIdAndUpdate(req.params.item, update, options, function(err, object){
			var l = object.comments.length
			var comment = object.comments[l-1]
			res.send(comment)
		})
		
	})
	
	
	return app
}

