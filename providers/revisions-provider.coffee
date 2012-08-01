require 'coffee-script'
_ = require('underscore')
database = require('./db')
wikipages_provider = require './wikipages-provider'

db = null

exports.setup = (database) ->
	db = database	

exports.fetch = (revision_id, callback) ->
	revision_id = database.normalizeID revision_id
	db.collection 'revisions', (err, revisions)->
		revisions.findOne revision_id, (err, revision)->
			wikipages_provider.fetch revision.page, (err, wikipage) ->
				_.extend revision, { page : wikipage }
				callback err, revision
