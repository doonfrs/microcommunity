define([
	'bb',
	'models/item',	
], function(Backbone, Item){

	var Post = Item.extend({

		msg : function(){			
			var msg
			if ( this.get('wall').id == this.get('author').get('wall').id )	
				msg = ' posted on his wall '
			else
				msg = ' posted on ' 
					+ this.get('wall').get('owner').get('displayName') 
					+ '\'s wall '
		
			return this.get('author').get('displayName') 
				+ msg 
				+ this.get('content')		
		}	
	})
	
	return Post

})
