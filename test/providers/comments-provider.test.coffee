process.env.NODE_ENV = 'test';

assert = require("assert")
database = require('./../../providers/db')
posts_provider = require('./../../providers/posts-provider')
users_provider = require('./../../providers/users-provider')
comments_provider = require('./../../providers/comments-provider')

db = null

resetDB = (callback)->
	db.collection 'posts', (err, docs)->
		docs.remove {}, ()->
			db.collection 'users', (err, docs)->
				docs.remove {}, ()->
					callback()

describe 'Comments Provider', ()->

	before (done)->
		database.connectDB (err, database)->
			db = database
			users_provider.setup database
			posts_provider.setup database
			comments_provider.setup database			
			resetDB(done)
			
			
	describe 'Posts Comments', ()->
	
		describe 'creating a new comment', ()->
		
			post = null
			user = null
			
			before (done)->
				user_attr = 
					email : "email@service.com"
					password : "Password"
	
				users_provider.create user_attr, (err, created_user)->
					user = created_user
					post_attr = 
						text: "A Post"
						user: created_user._id
						created_at : Date()	
							
					posts_provider.createPost post_attr, (err, p)->
						post = p
						done()		
						
			it 'should add the comment to the post object', (done)->
				comment = 
					text : "Hehe!"
					user : user._id
					created_at : new Date()				
					
				comments_provider.addComment comment, 'posts', post._id, (err)->
					db.collection 'posts', (err, collection)->
						collection.findOne { _id : database.normalizeID(post._id)}, (err, new_post)->
							assert.equal new_post.comments.length, 1
							assert.equal new_post.comments[0].text, comment.text
							assert.equal new_post.comments[0].user.toString(), comment.user.toString()
							done()
						
						
