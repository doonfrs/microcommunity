define([
	'modelsdraft/user',
	'modelsdraft/item'	
], function(User, ItemModule) {	
	describe ('Item Model', function(){	
		var user, item
		before(function(){
			user = new User({ id : 'user-1', name : 'User'})
			item = new ItemModule.Item({ id : 'item-1', author : 'user-1' })
		})
		after(function(){
			user = null
			item = null
			Backbone.Relational.store.reset()
		})
		it ('should have an author relation', function(){
			item.get('author').should.be.ok
		})
		it ('should have an objectType property \'item\'', function(){
			item.get('objectType').should.equal('item')
		})	
	})							
						
})
