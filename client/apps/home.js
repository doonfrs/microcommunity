define([
	'models/core',
	'views/core'
], function(Core, Views){

	var App = new Backbone.Marionette.Application()	
		
	App.addRegions({
		mainRegion : '#social-stream'
	})
	
	//login	
	App.addInitializer(function(server){
		if (server.currentUser){
			App.currentUser = new Core.User(server.currentUser)
		}	
	})	
	
	//stream 
	App.addInitializer(function(server){
	
		App.mainStream = new Views.ItemsLayout()
		App.mainRegion.show(App.mainStream)
		
		//creating and showing publisher	
		if (App.currentUser){
			var publisher = new Views.PublisherView({
				wall : App.currentUser.get('wall')
			})
			App.mainStream.publisher.show(publisher)			
		}
		
		//creating and showing items	
		App.items = new Core.Items(server.data.items, { type : 'stream' })
		
		var items = new Views.ItemsView({	
			collection : App.items
		})
					
		App.mainStream.items.show(items)

		//connecting publisher and stream
		if (App.currentUser){
			App.vent.on('publisher:newitem', function(post){				
				post.save({}, {
					success : function(model){
						App.items.add(model, { at : 0 }) 
						App.vent.trigger('publisher:release')
					}, 
					error : function(model, xhr, options){
						console.log('error')
						console.log(model.toJSON())
					},								
				})		
			})		
		}
				

					
	})	

	return App
	
});

