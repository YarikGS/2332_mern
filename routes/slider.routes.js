const {Router} = require('express')
const config = require('config')
const multer  = require('multer')
const {check, body, validationResult} = require('express-validator')
const Slider = require('../models/Slider')
const Gallery = require('../models/Gallery')
const auth = require('../middleware/auth.middleware')
const router = Router()
// const move = require('../filemove');

// const fs = require('fs');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: './client/public/uploads/temp',
//     filename: function (req, file, cb) {
//         // null as first argument means no error
//         const path = require('path')
// 	    cb(null, Date.now() + path.extname(file.originalname) )
//     }
// })

// // Init upload
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 2500000
//     },

//     fileFilter: function (req, file, cb) {
//         sanitizeFile(file, cb);
//     }

// }).single('image')


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

// api/slider/add
router.post(
	'/add', //auth,
	async ( req, res, next ) => {
		try{
			upload(req, res, (err) => {
        if (err){
        	// return err
        	// clearTemp()
          return res.status(400).json({message: err.message})
        }else{
          // If file is not selected
          if (req.file == undefined) {
		            	// console.log()
		            	return res.status(400).json({message: 'No file selected!'})
		      }else{

		       const { caption, text, videoId } = req.body
           let {transparency} = req.body


						// if (caption.length < 5) {
						// 	// clearTemp()
						//     return res.status(400).json({
						// 		message: 'text minimum length is 5'
						// 	})
						// }

						if ( transparency < 0 || transparency > 100 ) {
						    return res.status(400).json({
								message: 'transparency should be in range 0-100'
							       })
						}

            if (transparency == undefined) {
              transparency = 0
            }

		        const sliderFile = req.file
		            	// console.log(sliderFile)

						// const oldPath = sliderFile['destination']+'/'+sliderFile['filename']

						// const newPath = './client/public/uploads/slider/'+sliderFile['filename']

		    //             const slider = new Slider({
						// 	caption, image: sliderFile['filename']
						// })

						// slider.save()

						// move(oldPath, newPath, (error) => {
						// 	if (error){
					 //        	// return err
					 //        	clearTemp()
					 //            return res.status(400).json({
						// 			message: error
						// 		})
					 //        }
						// } )
						// console.log(slider._id)
						// clearTemp()
		                // res.status(201).json({message:'success'})
              if (videoId !== null) {
                  console.log('try get gallery');
                  const gallery = Gallery.findById(videoId)

                  gallery.exec().then(function () {
                      // handle success
                      console.log('received gallery');
                  }).catch(function (err) {
                      // handle error
                      return res.status(404).json({message:"Video Not Found"})
                  });
              }


		    			cloudinary.v2.uploader.upload(sliderFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({message: err.message})
						    }
                 res.locals.slider_data = new Slider({
   								caption, text, transparency, videoId: videoId, image: result.secure_url, imageId: result.public_id
   							})
                console.log('uploaded img with data', res.locals.slider_data);
                res.locals.slider_data.save()
						  //   const slider = new Slider({
							// 	caption, text, transparency, videoId: videoId, image: result.secure_url, imageId: result.public_id
							// })
              //
							// slider.save()

						    res.status(201).json({message:'success'})
						})
		      }

		    }

		   })
		} catch(e){
      if ( res.locals.slider_data.imageId !== null && res.locals.slider_data.imageId !== undefined ) {
          cloudinary.uploader.destroy(res.locals.slider_data.imageId, function(result) { console.log('img delete in catch',result) })
      }
      res.status(500).json({ message: e })
		}
})
// api/slider/
router.get('/', async ( req, res ) => {
	try{
		const slider = await Slider.find()

		res.json(slider)
	} catch(e){
		res.status(500).json({ message: e })
	}
})
// api/slider/3
router.get('/:id', async ( req, res ) => {
	try{
		const slider = await Slider.findById(req.params.id)
    if (slider===null) {
      return res.status(404).json({message:'Slide not found'})
    }
		res.status(200).json(slider)
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/slider/remove/3
router.get('/remove/:id/:imageId', //auth,
	async ( req, res ) => {
	try{
		const slider_id = req.params.id
		const slider_image = req.params.imageId
		console.log(slider_image)
		await Slider.findByIdAndDelete(slider_id, function (err, doc) {
			cloudinary.uploader.destroy(slider_image, function(result) { console.log(result) })
		  // fs.unlinkSync('./client/public/uploads/slider/'+slider_image)
		  if (err) return res.status(500).json({ message: err })
		  res.status(200).json({ message: `success`, status: 200 })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

router.post(
	'/update/:id/:imageId', //auth,
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {
		        if (err){
		        	// return err
		        	// clearTemp()
		            return res.status(400).json({
						message: err
					})
		        }else{
		        	const slider_id = req.params.id
					const slider_image = req.params.imageId
					console.log(slider_image)
		        	const { caption, text, videoId } = req.body
              let {transparency} = req.body

					// if ( caption.length < 5 ) {
					// 	// clearTemp()
					//     return res.status(400).json({
					// 		message: 'caption field minimum length is 5'
					// 	})
					// }

					if ( transparency < 0 || transparency > 100 ) {
					    return res.status(400).json({
							message: 'transparency should be in range 0-100'
						})
					}

          if (transparency == undefined) {
            transparency = 0
          }

          if (videoId !== null) {
              console.log('try get gallery');
              const gallery = Gallery.findById(videoId)

              gallery.exec().then(function () {
                  // handle success
                  console.log('received gallery');
              }).catch(function (err) {
                  // handle error
                  return res.status(404).json({message:"Video Not Found"})
              });
          }

		            if ( req.file == undefined || req.file == null ) {
		            	Slider.findByIdAndUpdate(slider_id, {caption: caption, text: text, transparency: transparency, videoId: videoId}, function(err, slider){
			    			if (err) return res.status(500).json({ message: err })
			    			res.status(200).json({ message: `slider item ${slider} was updated`, id:slider_id, slider: slider  })
						})
		            }else{
		            	const sliderFile = req.file

						// const oldPath = sliderFile['destination']+'/'+sliderFile['filename']

						// const newPath = './client/public/uploads/slider/'+sliderFile['filename']

						// move(oldPath, newPath, (error) => {
						// 	if (error){
					 //        	// return err
					 //        	clearTemp()
					 //            return res.status(400).json({
						// 			message: error
						// 		})
					 //        }else{
					 //        	fs.unlinkSync('./client/public/uploads/slider/'+slider_image)
					 //        }
						// } )

						cloudinary.v2.uploader.upload(sliderFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

						    cloudinary.uploader.destroy(slider_image, function(result) { console.log(result) })

						    Slider.findByIdAndUpdate(slider_id, { caption: caption, text: text, transparency: transparency, videoId: videoId, image: result.secure_url, imageId: result.public_id }, function(err, slider){
				    			if (err) return res.status(500).json({ message: err })
				    			return res.status(200).json({ status: 200  })
							})
						})
		            }

		   //          Slider.findByIdAndUpdate(slider_id, update_data, function(err, slider){
		   //          	// clearTemp()
			  //   		if (err) return res.status(500).json({ message: err })
			  //   		res.status(200).json({ message: `slider item ${slider} was updated`, id:slider_id, slider: slider  })
					// });
		        }
		    })
		} catch(e){
			res.status(500).json({ message: e })
		}
	})


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

// function clearTemp() {
// 	const path = require('path');

// 	const directory = './client/public/uploads/temp';

// 	fs.readdir(directory, (err, files) => {
// 	  if (err) throw err;

// 	  for (const file of files) {
// 	    fs.unlink(path.join(directory, file), err => {
// 	      if (err) throw err;
// 	    });
// 	  }
// 	});
// }


module.exports = router
