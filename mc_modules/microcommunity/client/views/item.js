define([
	'bb',
	'text!templates/item.html',
	'views/item/actions',
	'views/item/message',
	'views/item-plugins/comments'
], function(Backbone, html, ActionsView, MessageView, CommentsThread){


	var DeleteButton = Backbone.Marionette.ItemView.extend({ 
		tagName : 'button',
		className : 'close',
		template : "&times;",
		events : {
			'click' : 'deleteButton'
		},
		deleteButton : function(e){
			e.preventDefault()
			if (confirm('Are you sure you want to delete this item?')){
				this.model.destroy({ wait : true })
			}
		}							
	})

	var ItemView = Backbone.Marionette.Layout.extend({	
		template : html,
		serializeData: function(){
			return _.extend(this.model.serialize())
		},
		regions : {
			content : '.content-region',
			message : '.message-region',
			actions : '.actions-region',
			plugin  : '.plugin-region',
			deleteButton : '.item-close'
		},		
		defaultRenderer : function(){	
		
			if (this.model.can('delete')){
				this.deleteButton.show(new DeleteButton({ model : this.model }))
			}
			
			/* this helper function takes a property (of the contentView)
				 -> if it is a View it returns it
				 -> if it is a function, it calls it passing itemViewType (wall or stream) and the wall object
				 -> else it returns it as it is
			*/			
		
			function normalizeProperty(property){
				var normalized
				if ('function' == typeof property){
					//testing if the function is an ItemView	
					var instance = new property()
					if (instance instanceof Backbone.Marionette.ItemView){
						normalized = property					
					}			
					else {
						normalized = property()
					}
						
				} else {
					normalized = property
				}
				return normalized	
			}		
			
			//TODO: create a generic logic here		
			ContentView = normalizeProperty(this.model.contentView)
			if (ContentView){
				this.content.show(new ContentView({ itemView : this, model : this.model }))					
			}
			
			//actions			
			if (this.model.actions){	
				var actions = new Backbone.Collection(this.model.actions)
				actions.on('all', function(action){
					this.trigger('action:' + action)
				}, this)		
				this.actions.show(new ActionsView({ collection : actions }))
			}					
						
			var MessageTemplate = normalizeProperty(this.model.messageTemplate)			
			if (MessageTemplate){				
				var message = new MessageView({
					itemView : this,
					model : this.model,
					template : MessageTemplate
				})
				this.message.show(message)				
			}
			
			var PluginView = this.model.pluginView
			if (PluginView) {
				this.plugin.show(new PluginView({
					itemView : this,
					model : this.model 
				}))			
			}
			
		},				
		onRender : function(){			
			this.defaultRenderer()
		}
		
	})	
	return ItemView	
})
