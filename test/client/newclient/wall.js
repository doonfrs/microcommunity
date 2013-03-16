define([
	'modelsdraft/user',
	'modelsdraft/wall',	
	'modelsdraft/item',	
], function(User, Wall, Item) {						
	describe('Wall model', function(){
		describe ('Wall belonging to a user', function(){
			var user, wall			
			before(function(){		
				user = new User({name : 'Name', id : 'user-1' })	
				wall = new Wall({id : 'wall-1', owner : 'user-1'	})						
			})

			after(function(){
				Backbone.Relational.store.reset()			
			})						
			it ('should have an owner association to the user', function(){
				wall.get('owner').should.be.ok
				wall.get('owner').id.should.equal( user.id)
			})			
		})
		
		describe ('Wall having a post', function(){
			var user, wall				
			describe ('Adding a new post to the wall', function(){
				before(function(){			
					user = new User({name : 'Name', id : 'user-1'  })	
					wall = new Wall({ 
						id : 'wall-1', 
						owner : 'user-1',
						items : [{
							content : "Hello, World!",
							author : this.user,
							itemType : 'post'
						}] 
					})							
				})		
		
				after(function(){
					Backbone.Relational.store.reset()
				})										
				it ('should have the new post inserted correctly', function(){
					wall.get('items').length.should.equal(1)
				})
				it ('should insert an item which is an instance of Post model', function(){	
					assert.equal(wall.get('items').first() instanceof Item.Post, true)
				})
				it ('should insert an item associated with the wall', function(){
					assert.ok(wall.get('items').first().get('wall'))
					wall.get('items').first().get('wall').id.should.equal(wall.id)						
				})
								
			})
		})			
	})
						
})
