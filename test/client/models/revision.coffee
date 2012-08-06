define [
	'cs!models/revision'
], (Revision)->

	describe 'Revision Model', ()->
		revision = null
		before ()->		
			user = 
				_id: "5006de43a836cb97c144ff81"
				email: "email@service.com"				
				
			revision = new Revision
				"page":
					"_id":"501d3d264eada77e0a000001"
					"created_at":"2012-08-04T15:17:58.111Z"
					"current_revision":
						"page":"501d3d264eada77e0a000001"
						"body":"asdf",
						"summary":null,
						"created_at":"2012-08-04T15:17:58.112Z"
						"_id":"501d3d264eada77e0a000002"
						"title":"asdf"
				"body":"asdf"
				"summary": "Summary of change"
				"created_at":"2012-08-04T15:17:58.112Z"
				"_id":"501d3d264eada77e0a000002"
				user : user
				comments : [
					{text : "this is a comment",	user : user }
					{text : "this is a comment",	user : user }						
					{text : "this is a comment",	user : user }						
				]				
				
		describe 'Revision-Page association', ()->		
			it 'should be associated to a page', ()->
				revision.get('page').constructor.name.should.be.equal 'WikiPage'
				
			it 'should be associated to the right page', ()->
				revision.get('page').id.should.be.equal "501d3d264eada77e0a000001"
				
		describe 'Revision-Comments association', ()->							
			it 'should have a comments association', ()->					
				assert.ok revision.get('comments')
				revision.get('comments').each (comment)->
					assert.equal comment.constructor.name, "Comment"
					
			it 'should initialize each comment with the right url', ()->	
				assert.ok revision.get('comments')
				revision.get('comments').each (comment)->
					assert.equal comment.url(), "/api/revisions/501d3d264eada77e0a000002/comments"
		
			
