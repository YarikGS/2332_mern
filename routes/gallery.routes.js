const {Router} = require('express')
const config = require('config')
const {check, validationResult} = require('express-validator')
const Gallery = require('../models/Gallery')
const router = Router()

// api/gallery/add
router.post(
	'/add',
	[
		check('url', 'URL is invalid').isURL(),
		check('caption', 'caption minimum length is 5').isLength({ min: 5 })
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
			const { url, caption } = req.body

			const gallery = new Gallery({
				url, caption
			})

			await gallery.save()

			res.status(201).json({gallery})
		} catch(e){
			res.status(500).json({ message: 'gallery action add error' })
		}
})
// api/gallery/
router.get('/', async ( req, res ) => {
	try{
		const gallery = await Gallery.find()
		res.json(gallery)
	} catch(e){
		res.status(500).json({ message: 'gallery action get all error' })
	}
})
// api/gallery/3
router.get('/:id', async ( req, res ) => {
	try{
		const gallery = await Gallery.findById(req.params.id)
		res.json(gallery)
	} catch(e){
		res.status(500).json({ message: 'gallery action get by id error' })
	}
})

// api/gallery/remove/3
router.get('/remove/:id', async ( req, res ) => {
	try{
		const gallery_id = req.params.id
		// await Gallery.remove({id:gallery_id})
		await Gallery.findByIdAndDelete(gallery_id, function (err, doc) {
		  if (err) return res.status(500).json({ message: err })
		  res.status(204).json({ message: `gallery item ${doc} was removed` })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery/update/3
router.post(
	'/update/:id',
	[
		check('url', 'URL is invalid').isURL(),
		check('caption', 'caption minimum length is 10').isLength({ min: 5 })
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


			const gallery_id = req.params.id
			const { url, caption } = req.body

			await Gallery.findByIdAndUpdate(gallery_id, {url: url, caption: caption}, function(err, gallery){
			    if (err) return res.status(500).json({ message: err })
			    res.status(200).json({ message: `gallery item ${gallery} was updated`, id:gallery_id, gallery: gallery  })
			});
		} catch(e){
			res.status(500).json({ message: e })
		}
	})

module.exports = router