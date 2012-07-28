define [
	'jquery'
	'backbone'
	'cs!models/activity'
	'cs!views/comments_thread'
	'jquery.gravatar'
	'general'
	'moment'
	'diff'
], ($, Backbone, Activity,CommentsThreadView) ->
	class WikiPageView extends Backbone.View
		className : "wikipage"

		normalTemplate: _.template($('#wikipage-template').html())
		editButtons: _.template($('#wikipage-edit-buttons-template').html())
		saveButtons: _.template($('#wikipage-save-buttons').html())
		wikipageBodyView: _.template($('#wikipage-body-view').html())
		wikipageBodyEdit: _.template($('#wikipage-body-edit').html())

		events:
			"click .edit-button": "editButton"
			"click .cancel-button": "cancelButton"
			"click .save-button": "saveButton"

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
				$(@el).find(".buttons").html @editButtons
		

			$(@el).find(".wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
		
			@

		expand: ->
			$(@el).find(".wikipage-body-area").html @wikipageBodyView {body: @model.get('body'), fullview: true}
	
		collapse: ->
			$(@el).find(".wikipage-body-area").html @wikipageBodyView {body: @model.get('body')}
		
		disable: ->
			$(@el).find(".wikipage-body-area").spin()
			$(@el).find('.wikipage-summary').attr('disabled','disabled'	)
			$(@el).find('.wikipage-body').attr('disabled','disabled'	)
			$(@el).find('.buttons .btn').addClass('disabled')
		
		enable: ->
			$(@el).find(".wikipage-body-area").spin(false)
			$(@el).find('.wikipage-summary').removeAttr('disabled'	)
			$(@el).find('.wikipage-body').removeAttr('disabled'	)
			$(@el).find('.buttons .btn').removeClass('disabled')		

		editButton: ->
			$(@el).find(".wikipage-body-area").html @wikipageBodyEdit body: @model.get 'body'
			$(@el).find(".wikipage-body").attr("rows", 3 + (@model.get('body').length/100) )
			$(@el).find(".buttons").html @saveButtons

		saveButton: ->
			@disable()
			old_text = @model.get 'body'
			@model.save({body: $(@el).find(".wikipage-body").val() },
				success : (model, response)=>
					activity = new Activity
						actor : current_user
						object: model.attributes
						object_type: "WikiPage"
						verb: "edit"
						diff: JsDiff.diffWords(old_text, @model.get 'body')
						summary: $(@el).find(".wikipage-summary").val()
					activity.save(null,
						success: (activity)=>
							@enable()
							window.mediator.trigger("new-silent-activity", activity)
							$(@el).find(".wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
							$(@el).find(".buttons").html @editButtons						 						
						) 			  		

				url : "/api/wikipages/#{@model.id}"
			)

		cancelButton: ->
			$(@el).find(".wikipage-body-area").html @wikipageBodyView body: @model.get 'body'
			$(@el).find(".buttons").html @editButtons		

