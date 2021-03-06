const {Router} = require('express')
const config = require('config')
const multer  = require('multer')
const {check, body, validationResult} = require('express-validator')
const Team = require('../models/Team')
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

// api/team/add
router.post(
	'/add', auth,
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {
		        if (err){
		        	// return err
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

		            	const { caption, text, email, instagram } = req.body


						if (caption.length < 2 || text.length < 2 ) {

						    return res.status(400).json({
								message: 'text fields minimum length is 2'
							})
						}

		            	const teamFile = req.file

						cloudinary.v2.uploader.upload(teamFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

							const team = new Team({
								caption, text, email:email, image: result.secure_url, imageId: result.public_id, instagram
							})

							team.save()

						    res.status(201).json({message:'success'})
						})
		            }

		        }

		    })
		} catch(e){
			res.status(500).json({ message: e })
		}
})
// api/slider/
router.get('/', async ( req, res ) => {
	try{
		const team = await Team.find()

		res.json(team)
	} catch(e){
		res.status(500).json({ message: e })
	}
})
// api/slider/3
router.get('/:id', async ( req, res ) => {
	try{
		const team = await Team.findById(req.params.id)
		res.json(team)
	} catch(e){
		res.status(500).json({ message: e })
	}
})

// api/slider/remove/3
router.get('/remove/:id/:imageId', auth,
 async ( req, res ) => {
	try{
		const team_id = req.params.id
		const team_image = req.params.imageId
		await Team.findByIdAndDelete(team_id, function (err, doc) {
		  cloudinary.uploader.destroy(team_image, function(result) { console.log(result) })
		  if (err) return res.status(500).json({ message: err })
		  res.status(200).json({ message: `success`, status: 200 })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

router.post(
	'/update/:id/:imageId', auth,
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {
		        if (err){
		        	// return err

		            return res.status(400).json({
						message: err
					})
		        }else{
		        	const team_id = req.params.id
					const team_image = req.params.imageId

		        	const { caption, text, email, instagram } = req.body

					if (caption.length < 2 || text.length < 2 ) {

					    return res.status(400).json({
							message: 'text fields minimum length is 2'
						})
					}

		            // If file is not selected
		            if ( req.file == undefined || req.file == null ) {
		            	Team.findByIdAndUpdate(team_id, {caption: caption, text: text, email: email, instagram: instagram}, function(err, team){
			    			if (err) return res.status(500).json({ message: err })
			    			res.status(200).json({ message: `team item ${team} was updated`, id:team_id, team: team  })
						})
		            }else{
		            	const teamFile = req.file

						cloudinary.v2.uploader.upload(teamFile.path, function(err, result) {
						    if (err) {
						    	return res.status(400).json({
									message: err.message
								})
						    }

						    //delete old image when new image successfully uploaded
						    cloudinary.uploader.destroy(team_image, function(result) { console.log(result) })

						    Team.findByIdAndUpdate(team_id, { caption: caption, text: text, email: email, image: result.secure_url, imageId: result.public_id, instagram: instagram}, function(err, team){
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
