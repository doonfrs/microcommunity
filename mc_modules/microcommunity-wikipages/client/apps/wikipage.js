define([
	'app',
	'views/material-sidebar',	
	'views/sidebars/new-wikipage',		
	'views/wikipage',
	'modules/publisher',
	'modules/stream',	
	'models/wikipage',
	'views/publishers/post',
], function(App, MaterialSidebar, NewWikipageSidebarView, WikipageView, publiserhModule, streamModule, Wikipage, PostPublisher){

	var wikipage = Wikipage.findOrCreate(server.data.wikipage)
		
	App.addInitializer(function(){	
		App.wikipage.show(new WikipageView({ model : wikipage }))
	})	
	
	App.addRegions({
		materialSidebar : '#material-sidebar-region',	
		newWikipageSidebar : '#new-wikipage-sidebar-region',	
		wikiSidebar : '#wiki-sidebar-region',
		wikipage : '#wikipage-region',
		publisher : '#publisher-region',
		wall : '#wall-region'	
	})
	
	App.addInitializer(function(){
		App.materialSidebar.show(new MaterialSidebar(server.data.wikipage.container))		
	})
		
	if (App.isLoggedIn()){
		var options = {
			wall : wikipage.get('wall'),
			identifier : 'wikipage-wall',
			publishers : [PostPublisher]
		}		
		var Publisher = publiserhModule(App, App.publisher, options)		
	}

	var options = { 
		items : server.data.items, 
		type : 'wall',
		wall : wikipage.get('wall')
	}
	var Stream = streamModule(App, App.wall, options)		
		
	return App
	
	
	return App
})
