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
		'click #expand' : "expand"
		'click #collapse' : "collapse"

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
		else
			$(@el).find("#buttons").html @editButtons
		

		$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		
		@

	expand: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyView {body: @model.get('body'), fullview: true}
		$(@el).find("#expand")
	
	collapse: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyView {body: @model.get('body')}

	editButton: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyEdit body: @model.get 'body'
		$(@el).find("#wikipage-body").attr("rows", 3 + (@model.get('body').length/100) )
		$(@el).find("#buttons").html @saveButtons

	saveButton: ->
		@model.save({body: $("#wikipage-body").val()},
			success : ()=>
				$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
				$(@el).find("#buttons").html @editButtons
			url : "/api/wikipages/#{@model.id}"
		)

	cancelButton: ->
		$(@el).find("#wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		$(@el).find("#buttons").html @editButtons		

