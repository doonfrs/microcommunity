define([
	'bb',
	'text!templates/browse-materials-form.html',
	'views/course-select'
], function(Backbone, html, CourseSelect){	


	var YearOption = Backbone.Marionette.ItemView.extend({
		tagName : 'option',
		template : "<%= year - 1 %> - <%= year %>",
		onRender : function(){
			$(this.el).attr('value', this.model.get('year'))
		}	
	})
	
	var YearSelect = Backbone.Marionette.CompositeView.extend({
		tagName : 'select',
		attributes : {
			name : 'academicYear'
		},
		itemView : YearOption,
		template : '<option></option>'
	})
	
	var BrowseMaterialsForm = Backbone.Marionette.Layout.extend({	
		template : html,
		regions : {
			academicYearSelect : '#academic-year-select-region',
			courseSelect : '#course-select-region'
		},
		onRender : function(){
			var years = new Backbone.Collection([ {year:2013}, {year:2012}, {year:2011} ])
			this.academicYearSelect.show(new YearSelect({ collection : years }))
			this.courseSelect.show(new CourseSelect({ collection : this.options.courses }))			
		}		
	})		
	return BrowseMaterialsForm	
})
