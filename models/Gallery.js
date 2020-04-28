const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	url: {type: String, required: true},
	caption: { type: String, required: true},
	// category: { type: String },
	director: { type: String },
	pop: { type: String },
	production: { type: String },
	category:  {type: Types.ObjectId, ref: 'Gallery_category'},
	image: { type: String },
	imageId: { type: String },
	type: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Gallery', schema)