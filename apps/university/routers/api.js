var mongoose = require('mongoose')
	, User = mongoose.model('User')
	, Post = mongoose.model('Post')
	, Wall = mongoose.model('Wall')
	, Material = mongoose.model('Material')
	, models = require('microcommunity/models')
	, auth = require('microcommunity').auth		
	, can = require('microcommunity').can
	
var express = require('express');
var router = new express.Router();	

router.get('/materials/:material', function(req, res){
	Material.findById(req.params.material, function(err, material){
		res.send(material)
	})
})

router.post('/materials/:id/sections', /*fetchMaterial, user.can('add a section'),*/ function(req, res){
	var section = {
		title : req.body.title,
		description : req.body.description
	}
	Material.findByIdAndUpdate(req.params.id, { $push : { sections : section } }, function(err, material){	
		res.send(200, section)
	})		
})

router.post('/materials/:id/sections/:section/highlight', function(req, res){
	var section = req.body
	var update = { $set : { highlighted : req.params.section } }
	Material.findByIdAndUpdate(req.params.id, update, function(err, material){	
		res.send(200, section)
	})
})	

//adding a new section
router.post('/materials/:material/sections/:section/attachements', function(req, res){	

	//preparing attachment
	var attachement = req.body
	var objectType = models.convert(req.body.object.type, 'object', 'collection')
	var objectId = req.body.object.id
	attachement.object = new mongoose.Types.DBRef(objectType, objectId)
	
	//query and update objects
	var query = { _id : req.params.material, 'sections._id' : req.params.section }			
	var update = 	{ $push : { 'sections.$.attachements' :  attachement } }
	
	Material.findOneAndUpdate(query, update, function(err, material){
		res.send(200, attachement)
	})

})

//semester-wall
router.post('/walls/:wall/material/post', function(req, res){
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
					can.authorize(post, 'item', 'comment', req.user, function(err, post){
						res.send(post)
					})	
				})				
			})
		})
	
	})		
})

router.post('/walls/material/photo', function(req, res){	
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

module.exports = router


