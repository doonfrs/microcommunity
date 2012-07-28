define [
	'backbone'
	'cs!models/post'
	'cs!models/wikipage'
], (Backbone, Post, WikiPage) ->
	class Activity extends Backbone.Model
		defaults:
			verb: "create"
		
		idAttribute: "_id"

		url: ->
			"/api/activities/"

		initialize: (options)->
			#@comments = new Comments		
			
		
			@post = new Post
			if options?
				#@comments.add options.comments
				model_classes = 
					WikiPage : WikiPage
					Post: Post				
				@object = new model_classes[@get('object_type')](options.object) 
				@actor = options.actor
				


