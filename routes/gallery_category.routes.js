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
	'/add', auth,
	[
		// check('url', 'URL is invalid').isLength({ min: 5 }),
		check('caption', 'Caption is too short').isLength({ min: 2 }),
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
				caption, type } = req.body

			const gallery_category = new Gallery_category({
				caption, type
			})

			await gallery_category.save()

			res.status(201).json({gallery_category})
		} catch(e){
			res.status(500).json({ message: e })
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
			// res.json(gallery_categories)

			const functionWithPromise = item => { //a function that returns a promise
			  return new Promise(function(resolve, reject) {
						let count_items
					  let new_item = item.toObject();
						console.log(new_item.type);
						if (new_item.type == 'gallery' || new_item.type == 'contacts') {
							console.log('count Gallery model');
							// Gallery.countDocuments({ type: new_item.type }, function (err, count) {
							//   console.log('there are %d items for %s', count, new_item.caption);
							// 	count_items = count
							// });
							Gallery.countDocuments({ category: new_item._id }, function (err, count) {
							  console.log('there are %d items for %s', count, new_item.caption);
								new_item.count_items = count
								resolve(new_item)
							});

							// const counter = Gallery.countDocuments({ type: new_item.type })
							//
					    // console.log('removed slider');
					    // counter.exec().then(function (result) {
					    //     // handle success
					    //     console.log('res should be sent', result);
							// 			new_item.count = result
							//
							// 			console.log('new counted', new_item);
							// 			return resolve(new_item)
					    //     // return res.status(200).json({ message: 'sussess', code:200 })
					    // })
						}else{
							console.log('count Photos model');
							Photo.countDocuments({ category: new_item._id }, function (err, count) {
							  console.log('there are %d items for %s', count, new_item.caption);
								new_item.count_items = count
								resolve(new_item)
							});
						}
						// new_item.count = count_items
						console.log('new item is', new_item);
						// new_item.vimeo_response = body;

						// if (item.category !== null ) {new_item.category = item.category.caption}

						// console.log(new_item);
						// resolve( new_item )
			  });
			}

			const anAsyncFunction = async item => {
			  return functionWithPromise(item)
			}

			const getData = async () => {
			  return Promise.all(gallery_categories.map(item => anAsyncFunction(item)))
			}

			getData().then(new_gallery => {
				// console.log('new', new_gallery)
			  res.json(new_gallery)
			})



		} catch(e){
			res.status(500).json({ message: e })
		}
})

// api/gallery_category/remove/3
router.get('/remove/:id', auth,
	async ( req, res ) => {
	try{
		const gallery_category_id = req.params.id
		// await Gallery.remove({id:gallery_id})
		const gallery_category = await Gallery_category.findById(gallery_category_id)

		await Gallery_category.findByIdAndDelete(gallery_category_id, function (err, doc) {
		  if (err) return res.status(500).json({ message: err })




		})

		await Gallery.updateMany({"category": gallery_category._id}, {"$set":{"category": null}});

		await Photo.updateMany({"category": gallery_category._id}, {"$set":{"category": null}});

		res.status(200).json({ message: `success`, status: 200 })
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery_category/update/3
router.post(
	'/update/:id', auth,
	[
		// check('url', 'URL is invalid').isLength({ min: 5 }),
		check('caption', 'Caption is too short').isLength({ min: 2 }),
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

			    res.status(200).json({ status: 200 })
			});
		} catch(e){
			res.status(500).json({ message: e })
		}
	})

module.exports = router
