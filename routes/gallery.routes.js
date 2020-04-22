const {Router} = require('express')
const config = require('config')
const {check, validationResult, oneOf, param} = require('express-validator')
const Gallery = require('../models/Gallery')
const auth = require('../middleware/auth.middleware')
const router = Router()

// api/gallery/add
router.post(
	'/add', //auth,
	[
		check('url', 'URL is invalid').isURL(),
		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
		oneOf([
	       check('type').equals('gallery'),
	       check('type').equals('contacts'),
	    ], 'incorrect type of video'),
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
			const { url, caption, category, type } = req.body

			const request = require('request');

			const vimeo_test = await new Promise(function(resolve, reject) {
				request(`https://vimeo.com/api/oembed.json?url=${url}`, { json: true }, (err, res, body) => {
					// console.log(new_item);
					resolve( body )
				});

			  });
			
			if ( vimeo_test === '404 Not Found' ) { return res.status(400).json({
					status: 404,
					message: vimeo_test
				}) }

			const gallery = new Gallery({
				url, caption, category, type
			})

			await gallery.save()

			return res.status(201).json({gallery: gallery, status: 200})
		} catch(e){
			return res.status(500).json({ message: e })
		}
})
// api/gallery/
router.get('/all/:type',
	[
		oneOf([
	       param('type').equals('gallery'),
	       param('type').equals('contacts'),
	    ], 'incorrect type of video list'),
	], async ( req, res ) => {
		try{
			const gallery_type = req.params.type
			const gallery_category = req.query.category

			let search = { type: gallery_type }

			if ( gallery_category !== undefined && gallery_category.length ) {
				search.category = gallery_category
			}
		
			// console.log(gallery_type)
			// console.log(gallery_category.length)
			console.log(search)

			const gallery = await Gallery.find( search ).populate('category', 'caption')
	
			// const gallery = await Gallery.find()
			// res.json(gallery)
			const request = require('request');
			
			const functionWithPromise = item => { //a function that returns a promise
			  return new Promise(function(resolve, reject) {
				request(`https://vimeo.com/api/oembed.json?url=${item.url}`, { json: true }, (err, res, body) => {
				  if (err) { return reject(err); }
				  let new_item = item.toObject();
					new_item.vimeo_response = body;

					// if (item.category !== null ) {new_item.category = item.category.caption}
					
					// console.log(new_item);
					resolve( new_item )
				});

			  });
			}

			const anAsyncFunction = async item => {
			  return functionWithPromise(item)
			}

			const getData = async () => {
			  return Promise.all(gallery.map(item => anAsyncFunction(item)))
			}

			getData().then(new_gallery => {
				console.log(new_gallery)
			  res.json(new_gallery)
			})


		} catch(e){
			res.status(500).json({ message: e })
		}
})
// api/gallery/3
router.get('/:id', async ( req, res ) => {
	try{
		const gallery = await Gallery.findById(req.params.id)
		res.json(gallery)
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery/remove/3
router.get('/remove/:id', //auth, 
	async ( req, res ) => {
	try{
		const gallery_id = req.params.id
		// await Gallery.remove({id:gallery_id})
		await Gallery.findByIdAndDelete(gallery_id, function (err, doc) {
		  if (err) return res.status(500).json({ message: err })
		  res.status(200).json({ message: `success`, status: 200 })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery/update/3
router.post(
	'/update/:id', //auth,
	[
		check('url', 'URL is invalid').isURL(),
		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
		oneOf([
	       check('type').equals('gallery'),
	       check('type').equals('contacts'),
	    ], 'incorrect type of video'),
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
			const { url, caption, category, type } = req.body

			const request = require('request');

			const vimeo_test = await new Promise(function(resolve, reject) {
				request(`https://vimeo.com/api/oembed.json?url=${url}`, { json: true }, (err, res, body) => {
					// console.log(new_item);
					resolve( body )
				});

			  });
			
			if ( vimeo_test === '404 Not Found' ) { return res.status(400).json({
					status: 404,
					message: vimeo_test
				}) }

			await Gallery.findByIdAndUpdate(gallery_id, { url: url, caption: caption, category: category, type: type }, function(err, gallery){
			    if (err) return res.status(500).json({ message: err })
			    return res.status(200).json({ message: `gallery item ${gallery} was updated`, id:gallery_id, gallery: gallery, status: 200  })
			});
		} catch(e){
			return res.status(500).json({ message: e })
		}
	})

module.exports = router