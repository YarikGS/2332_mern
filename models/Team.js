const {Schema, model} = require('mongoose')

const schema = new Schema({
	caption: { type: String, required: true},
	text: { type: String, required: true},
	image: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Team', schema)