const {Router} = require('express')
const config = require('config')
const multer  = require('multer')
const {check, body, validationResult} = require('express-validator')
const Photo = require('../models/Photo')
const auth = require('../middleware/auth.middleware')
const router = Router()

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

// api/photo/add
router.post(
	'/add', //auth,
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {				
		        if (err){
		        	// return err 
		        	// clearTemp()
		            return res.status(400).json({
						message: err.message
					})
		        }else{
		            // If file is not selected
		            if (req.file == undefined) {
		            	// console.log()
		            	return res.status(400).json({
							message: 'No file selected!'
						})
		            }else{

		            	const { caption, text, category } = req.body

		            	const photoFile = req.file
		           
		    			cloudinary.v2.uploader.upload(photoFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

						    const photo = new Photo({
								caption:caption, text: text, category: category, image: result.secure_url, imageId: result.public_id
							})

							photo.save()

						    res.status(201).json({message:'success'})
						})
		            }		            

		        }
		    
		    })
		} catch(e){
			res.status(500).json({ message: e })
		}
})
// api/photo/
router.get('/', async ( req, res ) => {
	try{
		const photo = await Photo.find()

		res.json(photo)
	} catch(e){
		res.status(500).json({ message: 'photo action get all error' })
	}
})
// api/photo/3
router.get('/:id', async ( req, res ) => {
	try{
		const photo = await Photo.findById(req.params.id)
		res.json(photo)
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/photo/remove/3
router.get('/remove/:id/:imageId', //auth, 
	async ( req, res ) => {
	try{
		const photo_id = req.params.id
		const photo_image = req.params.imageId
		console.log(photo_image)
		await Photo.findByIdAndDelete(photo_id, function (err, doc) {
			cloudinary.uploader.destroy(photo_image, function(result) { console.log(result) })
		  // fs.unlinkSync('./client/public/uploads/photo/'+photo_image)
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
		        	const photo_id = req.params.id
					const photo_image = req.params.imageId
					console.log(photo_image)
		        	const { caption, text, category } = req.body

		            if ( req.file == undefined || req.file == null ) {
		            	Photo.findByIdAndUpdate(photo_id, {caption: caption, text: text, category: category}, function(err, photo){
			    			if (err) return res.status(500).json({ message: err })
			    			res.status(200).json({ message: `photo item ${photo} was updated`, id:photo_id, photo: photo  })
						})
		            }else{
		            	const photoFile = req.file

						cloudinary.v2.uploader.upload(photoFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

						    cloudinary.uploader.destroy(photo_image, function(result) { console.log(result) })

						    Photo.findByIdAndUpdate(photo_id, { caption: caption, text: text, category: category, image: result.secure_url, imageId: result.public_id }, function(err, photo){
				    			if (err) return res.status(500).json({ message: err })
				    			return res.status(200).json({ status: 200 })
							})
						})						
		            }            
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

module.exports = router