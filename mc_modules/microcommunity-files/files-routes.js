var mc = require('microcommunity')
	, Container = mc.model('Container')
	, File = mc.model('File')
	, FileActivity = mc.model('NewFileActivity')

exports.show = function(req, res){
	File.findById(req.params.file, function(err, file){	
		res.loadPage('file', {
			file : file,
		})
	})
}

exports.new = function(req, res){
	Container.findById(req.params.container, function(err, container){
		res.loadPage('file-form', { 
			container : container
		})		
	})
}

exports.create = function(req, res){	
	Container.findById(req.params.container, function(err, container){	

		mc.files.saveFile(req.files.file, '/downloads/', function(filePath){
		
			var file = new File({
				name : req.body.name,
				description : req.body.description,
				container : container.id,
				filePath : filePath
			})
	
			file.save(function(err, file){	
				var activity = new FileActivity({
					author : req.user._id,
					walls : [container.wall],
					file : file.id,
					streams : [req.user.stream, container.stream]
				})		
				activity.save(function(err, activity){
					res.redirect('/files/' + file.id)				
				})			
			})			
		
		})
		
	})
}
