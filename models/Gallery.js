const {Schema, model} = require('mongoose')

const schema = new Schema({
	url: {type: String, required: true},
	caption: { type: String, required: true},
	category: { type: String },
	date: { type: Date, default: Date.now}
})

module.exports = model('Gallery', schema)