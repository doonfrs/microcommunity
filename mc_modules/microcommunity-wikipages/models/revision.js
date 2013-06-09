var mongoose = require('mongoose')
	, models = require('microcommunity/models/index')
	, itemable = require('microcommunity/models/plugins/itemable')

var revisionSchema = new mongoose.Schema({
	content : String,
	summary : String,
	wikipage : { type : mongoose.Schema.Types.ObjectId, ref : 'Wikipage' },
	diff : mongoose.Schema.Types.Mixed
})

revisionSchema.pre('init', function(next, doc){
	this.model('Revision').populate(doc, 'wikipage', next)	
})

revisionSchema.plugin(itemable)

models.define('Revision', 'revision', 'revision', revisionSchema)
models.items.addItem('Revision', 'components/revision/model')
