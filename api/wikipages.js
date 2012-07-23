var provider = require('./../providers/wikipages-provider')
	, schemas = require('./../providers/mongoose-schemas')
	, mongoose = require('mongoose');
	
exports.index = function(req, res){
	provider.fetchWikiPages(function(err, wikipages){
		return res.send(wikipages);	
	});
};

exports.create = function(req, res){

	var wikipage = {
		title: req.body.title, 
    text: req.body.body,
    created_at : Date()
	};
  
  provider.createWikiPage(wikipage, function(err, new_wikipage){
	  return res.send(new_wikipage);     
  });	  
};


exports.show = function(req, res){
	provider.fetchWikiPage(req.params.wikipage, function(err, wikipage){
		return res.send(wikipage); 	
	});  
}

exports.update = function(req, res){
	console.log("hey!");
	
	var updated_wikipage = {
		title: req.body.title, 
    text: req.body.body,
    created_at : req.body.created_at
	};  
	
	provider.updateWikiPage(req.params.wikipage, updated_wikipage ,function(err, wikipage){
		return res.send(wikipage); 	
	});  
}



