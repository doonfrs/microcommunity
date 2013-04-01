define([
	'backbone',
	'backbone-relational'
], function(Backbone){

	var Item = Backbone.RelationalModel.extend({	
		urlRoot : 'api/posts',	
		constructor : function(){
		
			/* a small  hack in order to prevent the model from 
				 overriding the 'wall' reverseRelation which 
				 is set in the wall model */
				 
			var setup = true	 
			_.each(this.relations, function(relation){
				if (relation.key == 'author')
					setup = false			
			})
			
			if (setup) {
				this.relations.push({
					type : Backbone.HasOne,
					key : 'author',
					relatedModel : 'Core.User'
				})			
			}		
			
			Backbone.RelationalModel.prototype.constructor.apply(this, arguments)
		},
		
		initialize : function(attr, options){
			this.set('createdAt', new Date())
		},
		
		subModelTypeAttribute : 'itemType',
		subModelTypes : {
			'post' : 'Core.Post'
		},
		defaults : {
			objectType : 'item'
		}				
	})
	
	return Item
	
})
