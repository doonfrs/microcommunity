process.env.NODE_ENV = 'test';

assert = require("assert")
activities_provider = require('./../providers/activities-provider')
wikipages_provider = require('./../providers/wikipages-provider')
database = require('./../providers/db')

db = null

resetDB = (done)->
	db.collection 'activities', (err, docs)->
		docs.remove {}, ()->
			db.collection 'users', (err, docs)->
				docs.remove {}, ()->
					db.collection 'wikipages', (err, docs)->
						docs.remove {}, ()->
							db.collection 'revisions', (err, docs)->
								docs.remove {}, ()->
									db.close()
									done()




describe 'Activities provider', ()->

	wikipage = null
	actor = null
	activity = null
	
	before (done)->
		database.connectDB (err, database)->
			db = database
			activities_provider.setup database
			wikipages_provider.setup database

			actor =		
				email : "actor@email.com"
				password : "Password"	

			db.collection 'users', (err, users)->
				users.insert actor, (err, user)->
					actor = user[0]
					attr = 
						title: "Title"
						body: "Body"
						created_at : Date()
				
					wikipages_provider.createWikiPage attr, (err, object)->
						actor_id = actor._id
						wikipage = object
						activity = 
							actor : actor_id
							verb  : "some verb"
							object: object._id
							object_type : "WikiPage"
						db.collection 'activities', (err, activities)->
							activities.insert activity, (err, new_activity)->	
								activity = new_activity[0]
								done()						
	
	describe 'createActivity', ()->				
		it 'should create a new activity object'


			
	describe 'fetchActivity', ()->

		it 'should return a correct activity object', (done)->
			activities_provider.fetchActivity activity._id, (err, act)->
				assert.equal act._id.toString(), activity._id.toString()
				done()
				
		it 'should return an activity object joined to the right actor', (done)->
			activities_provider.fetchActivity activity._id, (err, act)->
				assert.equal act.actor._id.toString(), actor._id.toString()
				done()		
		
		it 'should return an activity object joined to the right object', (done)->
			activities_provider.fetchActivity activity._id, (err, act)->
				assert.equal act.object._id.toString(), wikipage._id.toString()
				done()
							
		it 'should return a correct activity object (passing ObjectID as a string)', (done)->
			activities_provider.fetchActivity activity._id.toString(), (err, act)->
				assert.equal act._id.toString(), activity._id.toString()
				done()
						
		it 'should return an activity object joined to the right actor (passing ObjectID as a string)', (done)->
			activities_provider.fetchActivity activity._id.toString(), (err, act)->
				assert.equal act.actor._id.toString(), actor._id.toString()
				done()		
				
		it 'should return an activity object joined to the right object (passing ObjectID as a string)', (done)->
			activities_provider.fetchActivity activity._id.toString(), (err, act)->
				assert.equal act._id.toString(), activity._id.toString()
				done()
						
		
	describe 'fetchActivities', ()->
		it 'should return a list of latest 5 activities'
		describe 'pagination', ()->
			it 'should return the from the right point'
			it 'should return the right number of objects'
	
	after (done)->
		resetDB(done)		
		
