class window.ActivityStream extends Backbone.View
	el: '#social-stream'
	template: _.template($('#activity-stream-template').html())
	
	events:
		'click #load-more' : 'loadMore'
	
	initialize: ->
    _.bindAll @
    #initializing models collections
    @posts = new Posts    
    @wikipages = new WikiPages    
    @questions = new Questions    
    @links = new Links
    
    @current_index = 5
    @loadable = true
        
    @activities = new Activities
    @activities.bind 'add', @appendActivity
                    
    #bindings publisher events to the stream
    window.mediator.bind "new-post", (post)=>
      @addPost post  
    window.mediator.bind "new-wikipage", (wikipage)=>
      @addWikipage wikipage
    window.mediator.bind "new-question", (question)=>
      @addQuestion question
    window.mediator.bind "new-link", (link)=>
      @addLink link
    window.mediator.bind "new-silent-activity", (activity)=>
      @addSilentActivity activity
    window.mediator.bind "new-activity", (activity)=>
      @addActivity activity      
          
      

    @render()

    #initializing posts rendered from the server
    init_activities = new Activities
    init_activities.add eval(activities)
    @process init_activities
    
                    
    wikipage = new WikiPage
    wikipageView = new WikiPageView        model: wikipage
    #@injectView wikipageView
    
    post = @posts.last()
    
    activity = new Activity
		  actor : current_user
		  object: wikipage
		  verb: "edit"
                            
    #activityView = new ActivityView        model: activity
    #@injectView activityView
          

  render: ->
  	$(@el).html @template posts: JSON.stringify(@posts)
  	@
          
  #injecting views
   
  injectActivity: (activity)=>
  	activityView = new ActivityView model: activity
  	@injectView activityView

  appendActivity: (activity)=>
  	collection = new Activities
  	collection.add activity
  	activityView = new ActivityView 
  		collection: collection
  	@appendView activityView
    
  injectView: (view)=>
    $("#activity-stream-table").prepend(view.render().el)
    
  appendView: (view)=>
    $("#activity-stream-table").append(view.render().el)    
    
  loadMore : ()->	
  	@activities.fetch
  		data: 
  			from: @current_index
  			to: 5
  		success: (collection, response)=>
  			@current_index = @current_index + 5  			
  			if collection.length == 0
  				$(@el).find("#load-more").addClass("disabled")
  				$(@el).find("#load-more").html("Nothing more!")
  			@process collection

	process : (collection)->
		aggrs = []
		collection.each (scanned)=>
			verb = scanned.get 'verb'
			actor = scanned.actor
			object_type = scanned.get 'object_type'
			object_id = scanned.object.id
			aggr = {}
			aggr[collection.indexOf(scanned)]	= true
			collection.each (compared) =>				
				if scanned.id isnt compared.id
					if (object_id is compared.object.id) and (verb == compared.get 'verb') and (actor._id is compared.actor._id)
						aggr[collection.indexOf(compared)] = true
			aggrs.push aggr	
			
		arrgs = @refine aggrs
		_.each arrgs, (group) =>
			if true
				@appendAggr collection, _.keys(group)

		
	refine : (array) ->
		to_be_removed = {}
		scanned = {}		
		_.each array, (x)->			
			_.each array, (y)->
				if not scanned[array.indexOf(y)] 
					if x isnt y
						if _.isEqual(x, y)
							scanned[array.indexOf(y)] = true
							to_be_removed[array.indexOf(y)] = true
			scanned[array.indexOf(x)] = true
		new_array = []
		_.each array, (x)->
			unless to_be_removed[array.indexOf(x)]
				new_array.push x
		new_array
			
	
	appendAggr : (collection, array)->
		aggr_collection = new Activities
		_.each array, (x)->
			aggr_collection.add collection.at(x) 
		activityView = new ActivityView
			collection: aggr_collection
		@appendView activityView
		
	addPost: (post)=>        
    post.save(null,
		  success: (post)=>
		  	@posts.add post
		  	activity = new Activity
		  		actor : current_user
		  		object: post.attributes
		  		object_type: "Post"
		  		verb: "create"
	  		@addActivity activity
  		)
	          
  addWikipage: (wikipage)=>
    wikipage.save(null,
		  success: (wikipage, response)=> 
		  	@wikipages.add wikipage
		  	activity = new Activity
		  		actor : current_user
		  		object: wikipage.attributes
		  		object_type: "WikiPage"
		  		verb: "create"
		  	#console.debug activity.object.get 'title'
		  	#console.debug wikipage.get 'title'			  		
	  		@addActivity activity
  		)


  addQuestion: (question)=>
    @questions.add question

  addLink: (link)=>
    @links.add link
    
  addSilentActivity: (activity)=>
  	activity.save(null,
  		success: (activity)=> 
  			@activities.add activity, {silent: true}
  			#@injectActivity activity
  		)
  		
  addActivity:(activity)=>
  	activity.save(null,
  		success: (activity)=> 
  			@activities.add activity, {silent: true}
  			@injectActivity activity
  		)  		

