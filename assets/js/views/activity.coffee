class window.ActivityView extends Backbone.View
	className: "activity"
	template: _.template($('#activity-template').html()),

	initialize: ->
		#@commentsThread = new CommentsThreadView 
			#collection: @model.comments
			#postId: @model.id
			
		@objectClass = @model.object.constructor.name		
			
		views_classes = 
			WikiPage : WikiPageView
			Post: PostView
			
		@view = new views_classes[@objectClass]
			model: @model.object
				
		_.bindAll @
		
		

	render: ->
		$(@el).html @template(_.extend(@model.attributes, {message : @message(), actor : @model.actor}) )
		#$(@el).find('.comments-thread').html @commentsThread.render().el
		$(@el).find('.embeded-content').html @view.render().el		
		@
				
		
	message: ->
			
		name = @model.actor.email
		messages = 
			WikiPage : 
				edit: "#{name} edited a wikipage titled #{@model.object.get('title')}"
				create: "#{name} edited a wikipage titled #{@model.object.get('title')}"
			Post: 
				comment: "#{name} commented a post"
		messages[@objectClass][@model.get('verb')]
		

