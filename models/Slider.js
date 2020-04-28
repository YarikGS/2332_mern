const {Schema, model} = require('mongoose')

const schema = new Schema({
	caption: { type: String },
	text: { type: String },
	transparency: { type: Number, default: 0 },
	videoId: { type: String, default: null },
	image: { type: String, required: true},
	imageId: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Slider', schema)