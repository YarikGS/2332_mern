const {Schema, model} = require('mongoose')

const schema = new Schema({
	caption: { type: String, required: true},
	text: { type: String },
	image: { type: String, required: true},
	imageId: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Slider', schema)