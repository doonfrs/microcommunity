define([
	'bb',
	'models/section',
	'models/user',
	'models/request'
], function(Backbone, Section, User, Request){
	
	var Course = Backbone.RelationalModel.extend({
		defaults : {
			'thumbnailPath' : '/publication.png'
		}
	})
	
	var Material = Backbone.RelationalModel.extend({
	initialize : function(data){
		var members = _.pluck(data.memberships, 'user')	
		for (var i=0; i<members.length; i++){
			members[i].roles = data.memberships[i].roles
		}			
		this.set('members', members)
	},
	idAttribute : '_id',
	link : function(){
		return '/materials/' + this.id
	},	
	urlRoot : '/api/materials/',	
	serialize : function(){
		return _.extend(this.toJSON(), { link : this.link() })
	},
	relations : [
		{
			type : Backbone.HasOne,
			key : 'wall',
			relatedModel : 'Core.Wall'
		},
		{
			type : Backbone.HasMany,
			key : 'sections',
			relatedModel : Section,
			reverseRelation : {
				key : 'parent'
			}	
		},	
		{
			type : Backbone.HasMany,
			key : 'members',
			relatedModel : User
		},
		{
			type : Backbone.HasOne,
			key : 'course',
			relatedModel : Course
		}											
	]				
	})

	return Material

})
