const {Schema, model} = require('mongoose')

const schema = new Schema({
	caption: { type: String, required: true},
	// url: {type: String, required: true, unique : true, dropDups: true},
	type: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Gallery_category', schema)