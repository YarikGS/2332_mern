const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
	url: {type: String, required: true},
	caption: { type: String, required: true},
	// category: { type: String },
	category:  {type: Types.ObjectId, ref: 'Gallery_category'
    },
	type: { type: String, required: true},
	date: { type: Date, default: Date.now}
})

module.exports = model('Gallery', schema)