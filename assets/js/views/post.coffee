class window.PostView extends Backbone.View
	className: "row-fluid post"
	template: _.template($('#post-template').html()),

	initialize: ->
		@commentsThread = new CommentsThreadView 
			collection: @model.comments
			postId: @model.id			

		_.bindAll @

	render: ->
		$(@el).html @template(@model.attributes)
		$(@el).find('.comments-thread').html @commentsThread.render().el
		@

