var mongoose = require('mongoose')
	, User = mongoose.model('User')
	, Post = mongoose.model('Post')
	, Wall = mongoose.model('Wall')
	, Material = mongoose.model('Material')
	, models = require('microcommunity/models')
	, auth = require('microcommunity').auth		
	, can = require('microcommunity').can

module.exports = function(app){

	app.post('/api/materials/:id/sections', /*fetchMaterial, user.can('add a section'),*/ function(req, res){
		var section = {
			title : req.body.title,
			description : req.body.description
		}
		Material.findByIdAndUpdate(req.params.id, { $push : { sections : section } }, function(err, material){	
			res.send(200, section)
		})		
	})

	app.post('/api/materials/:id/sections/:section/highlight', function(req, res){
		var section = req.body
		var update = { $set : { highlighted : req.params.section } }
		Material.findByIdAndUpdate(req.params.id, update, function(err, material){	
			res.send(200, section)
		})
	})	
	
	app.post('/api/materials/:id/memberships', auth.ensureAuthenticated, function(req, res){
		Material.findById(req.params.id, function(err, material){
		if (!material.isMember(req.user)){
			material.newMembership(req.user)
		}			
		material.addRole(req.user, 'mc:member')
		material.save(function(err){

			if (!err) {
				req.user.follow(material)
				req.user.save(function(err, user){
					res.send(200, material)	
				})
			}			
		})
		})
	})
	
	app.delete('/api/materials/:container/memberships/:membership', 
		auth.ensureAuthenticated,
		auth.ensureContainerMember(), 
		function(req, res){
			//TODO implement memebership removal
			req.container.save(function(err){				
				res.send(200, req.container)	
			})
	})

	//adding a new section
	app.post('/api/materials/:material/sections/:section/attachements', function(req, res){	
		var attachement = req.body
		var objectType = models.convert(req.body.object.type, 'object', 'collection')
		var objectId = req.body.object.id
		attachement.object = new mongoose.Types.DBRef(objectType, objectId)
	
		var section = req.params.section
	
		var sectionIndex = 'sections.' + section + '.attachements'
	
		var update = {}
		update[sectionIndex] = attachement
		
		Material.findByIdAndUpdate(
			req.params.material,
			{ $push : update }, 
			function(err, material){
				res.send(200, attachement)
		})
	
	})

	//semester-wall
	app.post('/api/walls/material/post', function(req, res){
		User.findById(req.body.author, function(err, author){
			Wall.findById(req.body.wall, function(err, wall){
				Material.findById(wall.owner.oid, function(err, container){
					var post = new Post({
						content : req.body.content,
						wall : req.body.wall,
						walls : [req.body.wall],
						author : author.id,		
						streams : [container.stream, author.stream]
					})	
					post.save(function(err){
						can.authorize(post.toJSON(), 'item', 'comment', req.user, function(err, post){
							res.send(post)
						})	
					})				
				})
			})
		
		})		
	})

	app.post('/api/walls/material/photo', function(req, res){	
			User.findById(req.body.author, function(err, author){
			var post = new Photo({
				content : req.body.content,
				wall : req.body.wall,
				walls : [req.body.wall],
				author : author.id,		
				//streams : [req.container.stream]
			})	
			post.save(function(err){
				res.send(post)
			})		
		})

	})
}
