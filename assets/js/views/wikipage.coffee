class window.WikiPageView extends Backbone.View
	className : "wikipage"

	normalTemplate: _.template($('#wikipage-template').html())
	editButtons: _.template($('#wikipage-edit-buttons-template').html())
	saveButtons: _.template($('#wikipage-save-buttons').html())
	wikipageBodyView: _.template($('#wikipage-body-view').html())
	wikipageBodyEdit: _.template($('#wikipage-body-edit').html())

	events:
		"click #edit-button": "editButton"
		"click #cancel-button": "cancelButton"
		"click #save-button": "saveButton"
		'click #read-more' : "expand"

	initialize: (options)->
		_.bindAll @
		if options.embeded
			@embeded = true
		@fullview = false
		@template = @normalTemplate
		@commentsThread = new CommentsThreadView collection: @model.comments

	render: ->
		$(@el).html @template _.extend(@model.attributes, {fullview: @fullview})
		$(@el).find('.comments-thread').html @commentsThread.render().el
		unless window.current_user?
			$(@el).find('.comments-text').hide()		
		

		$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		$(@el).find("#buttons").html @editButtons
		$(@el).find("#wikipage-history").hide()
		@showHistory = false

		if @embeded
			$(@el).find('.well').addClass('embeded')
		$('#content-stream-table').masonry( 'reload' )
		@

	expand: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyView {body: @model.get('body'), fullview: true}
		$('#content-stream-table').masonry( 'reload' )

	editButton: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyEdit body: @model.get 'body'
		$(@el).find("#wikipage-body").attr("rows", 3 + (@model.get('body').length/100) )
		$(@el).find("#buttons").html @saveButtons
		$('#content-stream-table').masonry( 'reload' )

	saveButton: ->
		@model.set {body: $("#wikipage-body").val()}
		$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		$(@el).find("#buttons").html @editButtons
		$('#content-stream-table').masonry( 'reload' )

	historyButton: ->
		if @showHistory
			$(@el).find("#wikipage-history").slideUp ()=>
				@showHistory = false
				$('#content-stream-table').masonry( 'reload' )

		else
			$(@el).find("#wikipage-history").show()
			@showHistory = true
			$('#content-stream-table').masonry( 'reload' )

	cancelButton: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		$(@el).find("#buttons").html @editButtons
		$('#content-stream-table').masonry( 'reload' )

