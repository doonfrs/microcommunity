var	async = require('async')
	, _ = require('underscore')

function RefResolvers(){}

RefResolvers.prototype.applyRefs = function (doc, refs, callback){
	var extension = {}
	refs.forEach(function(ref){
		if(ref)
			extension[ref.field] = ref.doc							
	})
	_.extend(doc, extension)				
	callback(null, doc)
}

RefResolvers.prototype.resolveRef = function(doc, ref, callback){
	this.database.getCollection(ref.collection)
		.findOne({ _id : doc[ref.field] }, function(err, doc){
			if(err) throw err			
			_.extend(ref, { doc : doc })
			callback(null, ref)			
	})
}

RefResolvers.prototype.resolveSingleRefs = function(doc, singleRefs, callback){
	var self = this
	async.map( singleRefs, 
		function(singleRef, callback){
			self.resolveRef(doc, singleRef, callback)
		}, function(err, singleRefs){
			self.applyRefs(doc, singleRefs, callback)				
		})
}

RefResolvers.prototype.resolveMultiRefs = function(doc, multiRefs, callback){
	var self = this	
	async.map(multiRefs, 
		function(multiRef, multiRefCallback){
			var ids = doc[multiRef.field]
			if(ids){
				async.map(ids, 
					function(id, idCallback){				
						self.database.getCollection(multiRef.collection)
							.findOne({ _id : id }, function(err, doc){
								idCallback(null, doc) 					
							})						
					}, function(err, docsArray){
						_.extend(multiRef, {doc : docsArray})
						multiRefCallback(null, multiRef)		
					})				
			} else {
				multiRefCallback(null, null)
			}					
		}, function(err, multiRefs){
			self.applyRefs(doc, multiRefs, callback)							
		}
	)	
}

RefResolvers.prototype.fetchArrayEmbededDocsJoins = function(doc, arrayDescriptors, callback){
	var self = this	
	async.map(arrayDescriptors, function(arrayDescriptor, arrayDescriptorCallback){
		var array = doc[arrayDescriptor.field]			
		if(array){
			async.map(array, 
				function(arrayElement, arrayElementCallback){
					self.resolveSingleRefs(arrayElement, arrayDescriptor.singleRefs, 
					function(err, joinedArrayElement){
						arrayElementCallback(null, joinedArrayElement)		
					})			
				}, function(err, joinedArrayElements){		
					_.extend(arrayDescriptor, { doc : joinedArrayElements })
					arrayDescriptorCallback(null, arrayDescriptor)								
				})
		}	else {
			arrayDescriptorCallback(null, null)								
		}																			
	}, function(err, arrayDescriptors){		
		self.applyRefs(doc, arrayDescriptors, callback)							
	})	
}

RefResolvers.prototype.resolveDBRefs = function(doc, DBRefs, callback){
	var self = this	
	async.map(DBRefs, 
		function(DBRef, callback){	
			var collectionName = doc[DBRef.field].namespace
			var id = doc[DBRef.field].oid.toString()
	
			self.database.getCollection(collectionName).findById(id, function(err, object){
				_.extend(DBRef, { doc : object })
				callback(null, DBRef)		
			})			
	}, function(err, resolvedDBRefs){
		self.applyRefs(doc, resolvedDBRefs, callback)	
	})
}


RefResolvers.prototype.hasRelationType = function(type){
	return (this._relations.hasOwnProperty(type) && this._relations[type].length > 0) 
}

RefResolvers.mixin = function(destObject){
	var property
	for( property in RefResolvers.prototype ){
    destObject.prototype[property] = RefResolvers.prototype[property];	
	}
}

module.exports = RefResolvers
