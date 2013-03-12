define([
	'models/item',
	'collections/items',	
], function(Item, Items){
	describe('Item Model', function(){
	
		describe('Item subtypes', function(){			
			before(function(){
				this.items = new Items([
					{ id : 1, type : 'post' }
				])					
			})			
			it ('should support PostItem subtype', function(){
				var post = this.items.get(1) 
				var test = post instanceof PostItem
				test.should.equal(true)
			})			
		})				
	})

})
