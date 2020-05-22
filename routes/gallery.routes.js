const {Router} = require('express')
const config = require('config')
const {check, validationResult, oneOf, param, body} = require('express-validator')
const Gallery = require('../models/Gallery')
const Slider = require('../models/Slider')
const auth = require('../middleware/auth.middleware')
const router = Router()
const multer  = require('multer')

//IMAGE UPLOAD CONFIGURATION

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const upload = multer({ storage: storage, fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    } }).single('image');

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dpoxszsea",
  api_key: config.get('CLOUDINARY_API_KEY') || process.env.CLOUDINARY_API_KEY,
  api_secret: config.get('CLOUDINARY_API_SECRET') || process.env.CLOUDINARY_API_SECRET
});

// const validate = validations => {
//   return async (req, res, next) => {
//     await Promise.all(validations.map(validation => validation.run(req)));

//     const errors = validationResult(req);
//     if (errors.isEmpty()) {
//       return next();
//     }

//     res.status(422).json({ errors: errors.array() });
//   };
// };

// api/gallery/add
router.post(
	'/add', auth,
	// [
	// 	check('url', 'URL is invalid').isURL(),
	// 	check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
	// 	oneOf([
	//        check('type').equals('gallery'),
	//        check('type').equals('contacts'),
	//     ], 'incorrect type of video'),
	// ],
	async ( req, res, next ) => {
		try{
			upload(req, res, (err) => {
		        if (err){
		        	// return err
		        	// clearTemp()
		            return res.status(400).json({
						message: err.message
					})
		        }else{

	            	const { url, caption, director, pop, production, category, type } = req.body

	            	// console.log(req.body)
					if (caption.length < 2) {
						// clearTemp()
					    return res.status(400).json({
							message: 'Caption is too short'
						})
					}

					if ( type !== 'gallery' && type !== 'contacts') {
						// clearTemp()
					    return res.status(400).json({
							message: 'incorrect type of video'
						})
					}

					if (url.length < 2) {
						// clearTemp()
					    return res.status(400).json({
							message: 'url is too short'
						})
					}


					// console.log(req.file)

					// // If file  selected
		            if ( req.file !== undefined  ) {
		            	const videoFile = req.file

		    			cloudinary.v2.uploader.upload(videoFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }else{
						    	const gallery_data = {
								url, caption, director:director, pop:pop, production:production, category, image: result.secure_url, imageId: result.public_id, type
								}

								console.log('gallery with image', gallery_data)
								res.locals.gallery_data = gallery_data
		            			return next()
								console.log('continuation')
								// const gallery = new Gallery({
								// url, caption, director:director, pop:pop, production:production, category, image: result.secure_url, imageId: result.public_id, type
								// })

		      //       			// console.log(gallery)

								// gallery.save()

								// res.status(201).json({message:'success'})
						    }
						})
		            }else{
		            	const gallery_data = {
								url, caption, director:director, pop:pop, production:production, category, image: null, imageId: null, type
								}

								console.log('gallery with no any image', gallery_data)
						res.locals.gallery_data = gallery_data
		            	return next()

		            	console.log('continuation 2')




						// const gallery = new Gallery({
						// 		url, caption, director:director, pop:pop, production:production, category, image: null, imageId: null, type
						// 		})

		    //         		// console.log(gallery)

						// gallery.save()

						// res.status(201).json({message:'success'})
		            }
		        }

		    })
		} catch(e){
			res.status(500).json({ message: e })
		}
},
async (req, res) => {

	console.log('next called')
	// console.log(res.locals.gallery_data)
// let new_item = gallery_data.toObject();
// console.log(new_item.url)

		const request = require('request');

			const vimeo_test = await new Promise(function(resolve, reject) {
				request(`https://vimeo.com/api/oembed.json?url=${res.locals.gallery_data.url}`, { json: true }, (err, res, body) => {
					// console.log(new_item);
					resolve( body )
				});

			  });

			if ( vimeo_test === '404 Not Found' ) {
				if ( res.locals.gallery_data.imageId !== null && res.locals.gallery_data.imageId !== undefined ) {
					cloudinary.uploader.destroy(res.locals.gallery_data.imageId, function(result) { console.log(result) })
				}
				return res.status(400).json({
					status: 404,
					message: vimeo_test
				})
			}
			// console.log('vimeo')
			const gallery = new Gallery(res.locals.gallery_data)

            		// console.log(gallery)

			gallery.save(function(error) {
			  if (error) {
			  	if ( res.locals.gallery_data.imageId !== null && res.locals.gallery_data.imageId !== undefined ) {
					       cloudinary.uploader.destroy(res.locals.gallery_data.imageId, function(result) { console.log(result) })
				    }
          return res.status(500).json({message:error})
			  }else{
          res.status(201).json({message:'success'})
        }
			})


})
// router.post(
// 	'/add', auth,
// 	[
// 		check('url', 'URL is invalid').isURL(),
// 		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
// 		oneOf([
// 	       check('type').equals('gallery'),
// 	       check('type').equals('contacts'),
// 	    ], 'incorrect type of video'),
// 	],
// 	async ( req, res ) => {
// 		try{
// 			// const baseUrl = config.get('baseUrl')
// 			const errors = validationResult(req)

// 			if (!errors.isEmpty()) {
// 				return res.status(400).json({
// 					errors: errors.array(),
// 					message: 'error'
// 				})
// 			}
// 			const { url, caption, director, pop, production, category, type } = req.body

// 			const request = require('request');

// 			const vimeo_test = await new Promise(function(resolve, reject) {
// 				request(`https://vimeo.com/api/oembed.json?url=${url}`, { json: true }, (err, res, body) => {
// 					// console.log(new_item);
// 					resolve( body )
// 				});

// 			  });

// 			if ( vimeo_test === '404 Not Found' ) { return res.status(400).json({
// 					status: 404,
// 					message: vimeo_test
// 				}) }

// 			const gallery = new Gallery({
// 				url, caption, director:director, pop:pop, production:production, category, type
// 			})

// 			await gallery.save()

// 			return res.status(201).json({gallery: gallery, status: 200})
// 		} catch(e){
// 			return res.status(500).json({ message: e })
// 		}
// })
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
			// console.log(search)

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
				// console.log(new_gallery)
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
router.get('/remove/:id', auth,
	async ( req, res ) => {
	try{
		const gallery_id = req.params.id
		const gallery = await Gallery.findById(req.params.id)

		await Gallery.remove({id:gallery_id})
		await Gallery.findByIdAndDelete(gallery_id, function (err, doc) {
			if ( gallery.imageId != null || gallery.imageId != undefined ) {
				cloudinary.uploader.destroy(gallery.imageId, function(result) { console.log(result) })
			}
		  if (err) return res.status(500).json({ message: err })

		})
    console.log('slider should be removed');
    await Slider.updateMany({"videoId": gallery_id}, {"$set":{"videoId": null}});
    res.status(200).json({ message: `success`, status: 200 })
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/gallery/update/3
router.post(
	'/update/:id/', auth,
	async ( req, res, next ) => {
		try{
			upload(req, res, (err) => {
		        if (err){
		        	// return err
		        	// clearTemp()
		            return res.status(400).json({
						message: err
					})
		        }else{
		        	res.locals.gallery_id = req.params.id
		        	const { image, url, caption, director, pop, production, category, type } = req.body

	            	// console.log(req.body)
					if (caption.length < 2) {
						// clearTemp()
					    return res.status(400).json({
							message: 'Caption is too short'
						})
					}

					if ( type !== 'gallery' && type !== 'contacts') {
						// clearTemp()
					    return res.status(400).json({
							message: 'incorrect type of video'
						})
					}

					if (url.length < 2) {
						// clearTemp()
					    return res.status(400).json({
							message: 'url is too short'
						})
					}




					// if ( caption.length < 5 ) {
					// 	// clearTemp()
					//     return res.status(400).json({
					// 		message: 'caption field minimum length is 5'
					// 	})
					// }

		            if ( req.file == undefined && image == undefined) {

		            	const gallery_data =
			            	{
								url:url, caption:caption, director:director, pop:pop, production:production, category:category, type:type
							}

								console.log('gallery with no any image', gallery_data)
						res.locals.gallery_data = gallery_data

		            	return next()

		    //         	Slider.findByIdAndUpdate(slider_id, {caption: caption, text: text, transparency: transparency, videoId: videoId}, function(err, slider){
			   //  			if (err) return res.status(500).json({ message: err })
			   //  			res.status(200).json({ message: `slider item ${slider} was updated`, id:slider_id, slider: slider  })
						// })
		            }else if( req.file == undefined && image === 'null'){
		    //         	const gallery = Gallery.findById(req.params.id)

		    //         	if ( gallery.imageId !== null && gallery.imageId !== undefined ) {
						// 	cloudinary.uploader.destroy(gallery.imageId, function(result) { console.log(result) })
						// }

						const gallery_data =
			            	{
								delete: 'delete', url:url, caption:caption, director:director, pop:pop, production:production, category:category, image: null, imageId: null, type:type
							}

								console.log('gallery with deleted image', gallery_data)
						res.locals.gallery_data = gallery_data

		            	return next()

		            }else if(req.file !== undefined){
		            	const galleryFile = req.file

						cloudinary.v2.uploader.upload(galleryFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

						 //    const gallery = Gallery.findById(req.params.id)

			    //         	if ( gallery.imageId !== null && gallery.imageId !== undefined ) {
							// 	cloudinary.uploader.destroy(gallery.imageId, function(result) { console.log(result) })
							// }


							const gallery_data =
			            	{
								delete: 'delete', url:url, caption:caption, director:director, pop:pop, production:production, category:category, image: result.secure_url, imageId: result.public_id, type:type
							}

								console.log('gallery with new image', gallery_data)
							res.locals.gallery_data = gallery_data

		            		return next()
						})
		            }
		        }
		    })
		} catch(e){
			res.status(500).json({ message: e })
		}
	},

	async (req, res) => {

		console.log('next called')
		console.log(res.locals.gallery_data)
// let new_item = gallery_data.toObject();
// console.log(new_item.url)
console.log('new id of gall', res.locals.gallery_id)

		if (res.locals.gallery_data.delete === 'delete') {
			const gallery = await Gallery.findById(req.params.id)

        	if ( gallery.imageId !== null && gallery.imageId !== undefined ) {
				cloudinary.uploader.destroy(gallery.imageId, function(result) { console.log(result) })
			}
		}
		const request = require('request');

			const vimeo_test = await new Promise(function(resolve, reject) {
				request(`https://vimeo.com/api/oembed.json?url=${res.locals.gallery_data.url}`, { json: true }, (err, res, body) => {
					// console.log(new_item);
					resolve( body )
				});

			  });

			if ( vimeo_test === '404 Not Found' ) {
				if ( res.locals.gallery_data.imageId !== null && res.locals.gallery_data.imageId !== undefined ) {
					cloudinary.uploader.destroy(res.locals.gallery_data.imageId, function(result) { console.log(result) })
				}
				return res.status(400).json({
					status: 404,
					message: vimeo_test
				})
			}
			// console.log('vimeo')
			await Gallery.findByIdAndUpdate(res.locals.gallery_id, res.locals.gallery_data, function(err, gallery){
			    if (err) return res.status(500).json({ message: err })
			    return res.status(200).json({ status: 200 })
			});

			// res.status(201).json({message:'success'})
	})
// router.post(
// 	'/update/:id', auth,
// 	[
// 		check('url', 'URL is invalid').isURL(),
// 		check('caption', 'caption minimum length is 5').isLength({ min: 5 }),
// 		oneOf([
// 	       check('type').equals('gallery'),
// 	       check('type').equals('contacts'),
// 	    ], 'incorrect type of video'),
// 	],
// 	async ( req, res ) => {
// 		try{

// 			const errors = validationResult(req)

// 			if (!errors.isEmpty()) {
// 				return res.status(400).json({
// 					errors: errors.array(),
// 					message: 'error'
// 				})
// 			}

// 			const gallery_id = req.params.id
// 			const { url, caption, director, pop, production, category, type } = req.body

// 			const request = require('request');

// 			const vimeo_test = await new Promise(function(resolve, reject) {
// 				request(`https://vimeo.com/api/oembed.json?url=${url}`, { json: true }, (err, res, body) => {
// 					// console.log(new_item);
// 					resolve( body )
// 				});

// 			  });

// 			if ( vimeo_test === '404 Not Found' ) { return res.status(400).json({
// 					status: 404,
// 					message: vimeo_test
// 				}) }

// 			await Gallery.findByIdAndUpdate(gallery_id, { url: url, caption: caption, director:director, pop:pop, production:production, category: category, type: type }, function(err, gallery){
// 			    if (err) return res.status(500).json({ message: err })
// 			    return res.status(200).json({ status: 200 })
// 			});
// 		} catch(e){
// 			return res.status(500).json({ message: e })
// 		}
// 	})

function sanitizeFile(file, cb) {
    // Define the allowed extension
    let fileExts = ['.png', '.jpg', '.jpeg', '.gif']
    const path = require('path')
    // Check allowed extensions
    console.log(path.extname(file.originalname))
    let isAllowedExt = fileExts.includes(path.extname(file.originalname).toLowerCase());
    // Mime type must be an image
    let isAllowedMimeType = file.mimetype.startsWith("image/")

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true) // no errors
    }
    else {
        // pass error msg to callback, which can be displaye in frontend
        cb('Error: File type not allowed!')
    }
}

module.exports = router
