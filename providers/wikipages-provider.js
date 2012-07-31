var mongoose = require('mongoose')
	, ObjectID = require('mongodb').ObjectID
	, schemas = require('./../providers/mongoose-schemas')
	, wikipages_provider = require('./../providers/wikipages-provider')
	, posts_provider = require('./../providers/posts-provider')
	, async = require('async')
  , _ = require('underscore')
  , database = require('./db');

var db ;

exports.setup = function (database){
	db = database;
	return db;
};

exports.model = mongoose.model('Wikipage', new mongoose.Schema({
	title: String,
	body: String
}));

exports.fetch = function (wikipage_id, callback){

	wikipage_id = database.normalizeID(wikipage_id);

	db.collection('wikipages', function(err, wikipages){
		wikipages.findOne({_id: wikipage_id }, function(err, wikipage){
			db.collection('revisions', function(err, revisions){
				revisions.findOne( { _id: wikipage.current_revision }, function(err, revision){
					_.extend(wikipage, {current_revision: revision});
					callback(err, wikipage);			
				});
			});				
		});	

	});	
}

exports.fetchWikiPages = function (callback){
	database.connectDB(function(err, database){
		db = database;	
		db.collection('wikipages', function(err, wikipages){
			wikipages.find()
				.toArray(function(err, results){
					callback(err, results);
				});
		});
	});	
}


exports.newRevision = function (wikipage, revision, callback){

	db.collection('revisions', function(err, revisions){		
		revisions.insert(revision, function(err, docs){
			var revision = docs[0];		
		
			var updated = {$set: {current_revision: revision._id }};
			
			db.collection('wikipages', function(err, wikipages_collection){
				wikipages_collection.findAndModify({_id : wikipage._id },[['_id','asc']],  updated, {},function(err, docs){
					exports.fetch(wikipage._id, function(err, updated_wikipage){
						callback(err, updated_wikipage);
					});				
				});
			});
		});
	});
}

exports.createWikiPage = function(attr, callback){

	db.collection('wikipages', function(err, wikipages_collection){
		var wikipage_attr = {
			title: attr.title,
			created_at : new Date()
		};

		wikipages_collection.insert(wikipage_attr, function(err, docs){
				var wikipage = docs[0];
				
				var revision = {
					page : wikipage._id,
					body : attr.body,
					summary : attr.summary,
					created_at : new Date()						
				};							
				
				exports.newRevision(wikipage, revision, function(err, new_wikipage){
					callback(err, new_wikipage);
				});				

		});
	});

}

exports.updateWikiPage = function(id, updated, callback){

	var object = new ObjectID(id);

	db.collection('wikipages', function(err, wikipages){
		wikipages.findOne({_id: object }, function(err, wikipage){
		
			
			var revision = {
				page : wikipage._id,
				body : updated.body,
				created_at : new Date()						
			};									
							
			
			exports.newRevision(wikipage, revision, function(err, wikipage){
				callback(err, wikipage);
			});			
				
		});	

	});

}

