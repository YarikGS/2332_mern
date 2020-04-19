const {Router} = require('express')
const config = require('config')
const {check, validationResult, oneOf} = require('express-validator')
const Gallery_category = require('../models/Gallery_category')
const Gallery = require('../models/Gallery')
const Photo = require('../models/Photo')
const auth = require('../middleware/auth.middleware')
const router = Router()

// api/gallery_category/add
router.post(
	'/add', //auth,
	[
		// check('url', 'URL is invalid').isLength({ min: 5 }),
		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
		oneOf([
	       check('type').equals('gallery'),
	       check('type').equals('contacts'),
	       check('type').equals('photo'),
	    ], 'incorrect type of category'),
	],
	async ( req, res ) => {
		try{
			// const baseUrl = config.get('baseUrl')
			const errors = validationResult(req)

			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'error'
				})
			}
			const { 
				// url, 
				caption } = req.body

			const gallery_category = new Gallery_category({
				caption
			})

			await gallery_category.save()

			res.status(201).json({gallery_category})
		} catch(e){
			res.status(500).json({ message: 'gallery category action add error' })
		}
})
// api/gallery_category/
router.get('/all/:type',
	oneOf([
	       check('type').equals('gallery'),
	       check('type').equals('contacts'),
	       check('type').equals('photo'),
	    ], 'incorrect type of category'),
	async ( req, res ) => {
		try{
			const gallery_categories = await Gallery_category.find({ type: req.params.type })
			res.json(gallery_categories)
		} catch(e){
			res.status(500).json({ message: 'gallery categories action get all error' })
		}
})

// api/gallery_category/remove/3
router.get('/remove/:id', //auth, 
	async ( req, res ) => {
	try{
		const gallery_category_id = req.params.id
		// await Gallery.remove({id:gallery_id})
		const gallery_category = await Gallery_category.findById(gallery_category_id)

		await Gallery_category.findByIdAndDelete(gallery_category_id, function (err, doc) {
		  if (err) return res.status(500).json({ message: err })

		  	Gallery.updateMany({"category": gallery_category._id}, {"$set":{"category": null}});

			Photo.updateMany({"category": gallery_category._id}, {"$set":{"category": null}});

		  res.status(204).json({ message: `gallery category item ${doc} was removed` })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery_category/update/3
router.post(
	'/update/:id', //auth,
	[
		// check('url', 'URL is invalid').isLength({ min: 5 }),
		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
		oneOf([
	       check('type').equals('gallery'),
	       check('type').equals('contacts'),
	       check('type').equals('photo'),
	    ], 'incorrect type of category'),
	],
	async ( req, res ) => {
		try{

			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'error'
				})
			}

			const gallery_category_id = req.params.id
			const { 
				//url,
				 caption } = req.body

			const gallery_category = await Gallery_category.findById(gallery_category_id)

			await Gallery_category.findByIdAndUpdate(gallery_category_id, {caption: caption}, function(err, gallery_category){
			    if (err) return res.status(500).json({ message: err })

				console.log(gallery_category.url)

				// if ( gallery_category.url !== url ) {

				// 	Gallery.updateMany({"category": gallery_category._id}, {"$set":{"category": _id}});

				// 	Photo.updateMany({"category": gallery_category._id}, {"$set":{"category": _id}});
				// }

			    res.status(200).json({ message: `gallery category item ${gallery_category} was updated`, id:gallery_category_id, gallery_category: gallery_category  })
			});
		} catch(e){
			res.status(500).json({ message: e })
		}
	})

module.exports = router