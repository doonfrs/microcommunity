define([
	'bb',
	'modules/post/model',	
	'text!./template.html'
],function(Backbone, Post, html){

	var PostPublisher = Backbone.Marionette.ItemView.extend({
	
		initialize : function(options){
			this.container = options.container
		},
				
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
					
		newPost : function(){					
			this.disable()			
			var post = new Post()			
			post.set({
				content : this.ui.input.val(),
				wall : this.container.wall.id,
				author : App.currentUser.id
			})
			
			App.vent.trigger('publisher:newitem', post)			
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
	
	return { 
		label : 'Post', 
		identifier : 'post', 
		view : PostPublisher 
	}	
	
})