define([
	'app',
	'models/index',
	'views/sidebars/basic',
	'views/new-material-form',
	'views/thumbnails',
	'views/browse-materials-form',	
	'models/materials',
], function(App, Models, basicSidebar, MaterialForm, Thumbnails, BrowseMaterialsForm, Materials){

	App.addRegions({
		materials : '#materials-region',
		browseMaterials : '#browse-materials-region'
	})
	
	App.addInitializer(function(){
		var materials = new Materials(server.data.containers)		
		App.materials.show(new Thumbnails({ collection : materials }))		
		App.browseMaterials.show(new BrowseMaterialsForm({ currentSemester : server.data.currentSemester }))
	})

	return App
	
});

