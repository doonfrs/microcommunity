define([
	'bb',
	'models/item',
	'models/wikipage',
	'activity/views/content',
	'text!activity/templates/message.html'
], function(Backbone, Item, Wikipage, ActivityView, messageTemplate){
	console.log(Item.prototype.relations)
	var Activity = Item.extend({
		messageTemplate : messageTemplate,
		contentView : ActivityView
	})		
	return Activity
})
