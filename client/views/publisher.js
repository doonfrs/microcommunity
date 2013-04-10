define([
	'bb',
	'text!templates/publisher.html'
],function(Backbone, html){

	var PublisherView = Backbone.Marionette.ItemView.extend({
				
		template : html,
		ui : {
			input : '#new-post',
			button : '#publish-button',
			spinner : '.spinner'
		},		
		events : {
			'click #publish-button' : 'newPost',
			'click #new-post' : 'expand'
		},	
			
		initialize : function(options){
			if (options && options.wall){
				this.wall = options.wall
			}
		},
					
		newPost : function(){					
			this.disable()									
			var post = {
				content : this.ui.input.val(),
				author : App.currentUser.id,
				wall : this.wall.id,
				itemType : 'post'
			}			
			App.vent.trigger('publisher:post:new', post)			
			var self = this			
			App.vent.once('publisher:release', function(){
				self.reset()
				self.enable()
			})			
		},
		
		expand : function(){
			this.ui.input.attr("rows","3")			
		},
		
		reset : function(){
			this.ui.input.val("")
		},
		
		disable : function(){
			this.ui.input.prop("disabled", true)
			this.ui.button.addClass('disabled')
			this.ui.spinner.spin()
		},
		
		enable : function(){
			this.ui.input.prop("disabled", false)
			this.ui.button.removeClass('disabled')
			this.ui.spinner.spin(false)				
		}		
	})	
	
	return PublisherView
	
})
