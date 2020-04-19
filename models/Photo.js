const {Schema, model} = require('mongoose')

const schema = new Schema({
	caption: { type: String },
	text: { type: String },
	category: { type: String },
	image: { type: String, required: true},
	imageId: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Photo', schema)