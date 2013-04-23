define([
	'app',
	'views/wikipage',
	'modules/publisher',
	'modules/stream',	
	'models/wikipage'
], function(MCApp, WikipageView, publiserhModule, streamModule, Wikipage){

	var App = new MCApp()
	App.setup(server)
		
	var wikipage = Wikipage.findOrCreate(server.data.wikipage)
		
	App.addInitializer(function(){	
		App.wikipage.show(new WikipageView({ model : wikipage }))
	})	
	
	App.addRegions({
		wikipage : '#wikipage-region',
		publisher : '#publisher-region',
		wall : '#wall-region'	
	})
	
	if (App.currentUser){
		var options = {
			wall : wikipage.get('wall'),
			identifier : 'wikipage-wall'
		}	
		var Publisher = publiserhModule(App, options, function(view){
			App.publisher.show(view)
		})	
		App.vent.on('publisher:newitem', function(item){				
			Stream.add(item) 
		})			
	}
		
	var options = { 
		items : server.data.items, 
		type : 'wall',
		wall : wikipage.get('wall'),
		width: '400px'
	}
	
	var Stream = streamModule(App, options, function(view){
		App.wall.show(view)
	})	
	

	
	return App
})
