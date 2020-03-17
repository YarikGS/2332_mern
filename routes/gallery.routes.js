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
		check('caption', 'caption minimum length is 10').isLength({ min: 10 })
	],
	async ( req, res ) => {
		try{
			const baseUrl = config.get('baseUrl')

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

router.get('/:id', async ( req, res ) => {
	try{
		const gallery = await Gallery.findById(req.params.id)
		res.json(gallery)
	} catch(e){
		res.status(500).json({ message: 'gallery action get by id error' })
	}
})

module.exports = router