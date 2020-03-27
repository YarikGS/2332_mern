const {Router} = require('express')
const config = require('config')
const multer  = require('multer')
const {check, body, validationResult} = require('express-validator')
const Slider = require('../models/Slider')
const router = Router()
const move = require('../filemove');

const fs = require('fs');

// Set storage engine
const storage = multer.diskStorage({
    destination: './client/public/uploads/temp',
    filename: function (req, file, cb) {        
        // null as first argument means no error
        const path = require('path')
	    cb(null, Date.now() + path.extname(file.originalname) )
    }
})

// Init upload
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 2500000
    },

    fileFilter: function (req, file, cb) {
        sanitizeFile(file, cb);
    }

}).single('image')

// api/slider/add
router.post(
	'/add',
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {				
		        if (err){
		        	// return err 
		        	clearTemp()
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

		            	const { caption } = req.body

		            	
						if (caption.length < 5) {
							clearTemp()
						    return res.status(400).json({
								message: 'caption minimum length is 5'
							})
						}

		            	const sliderFile = req.file
		                console.log(sliderFile)
		                console.log('caption inside', caption)

						const oldPath = sliderFile['destination']+'/'+sliderFile['filename']

						const newPath = './client/public/uploads/slider/'+sliderFile['filename']

		                const slider = new Slider({
							caption, image: sliderFile['filename']
						})

						slider.save()

						move(oldPath, newPath, (error) => {
							if (error){
					        	// return err 
					        	clearTemp()
					            return res.status(400).json({
									message: error
								})
					        }
						} )
						console.log(slider._id)
						clearTemp()
		                res.status(201).json({message:'success'})
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
		const slider = await Slider.find()

		res.json(slider)
	} catch(e){
		res.status(500).json({ message: 'slider action get all error' })
	}
})
// api/slider/3
router.get('/:id', async ( req, res ) => {
	try{
		const slider = await Slider.findById(req.params.id)
		res.json(slider)
	} catch(e){
		res.status(500).json({ message: 'slider action get by id error' })
	}
})

// api/slider/remove/3
router.get('/remove/:id/:image', async ( req, res ) => {
	try{
		const slider_id = req.params.id
		const slider_image = req.params.image
		console.log(slider_image)
		await Slider.findByIdAndDelete(slider_id, function (err, doc) {
		  fs.unlinkSync('./client/public/uploads/slider/'+slider_image)
		  if (err) return res.status(500).json({ message: err })
		  res.status(204).json({ message: `slider item ${doc} was removed` })
		})
	} catch(e){
		res.status(500).json({ message: e })
	}
})

router.post(
	'/update/:id/:image',
	async ( req, res ) => {
		try{
			upload(req, res, (err) => {				
		        if (err){
		        	// return err 
		        	clearTemp()
		            return res.status(400).json({
						message: err
					})
		        }else{
		        	const slider_id = req.params.id
					const slider_image = req.params.image

		        	const { caption } = req.body
		            	
					if (caption.length < 5) {
						clearTemp()
					    return res.status(400).json({
							message: 'caption minimum length is 5'
						})
					}

					let update_data

		            // If file is not selected
		            if (req.file == undefined) {
		            	// console.log()
		            	update_data = {caption: caption}
		            }else{
		            	const sliderFile = req.file

						const oldPath = sliderFile['destination']+'/'+sliderFile['filename']

						const newPath = './client/public/uploads/slider/'+sliderFile['filename']

						move(oldPath, newPath, (error) => {
							if (error){
					        	// return err 
					        	clearTemp()
					            return res.status(400).json({
									message: error
								})
					        }else{
					        	fs.unlinkSync('./client/public/uploads/slider/'+slider_image)
					        }
						} )

						update_data = { caption: caption, image: sliderFile['filename'] }
		            }

		            Slider.findByIdAndUpdate(slider_id, update_data, function(err, slider){
		            	clearTemp()
			    		if (err) return res.status(500).json({ message: err })
			    		res.status(200).json({ message: `slider item ${slider} was updated`, id:slider_id, slider: slider  })
					});		            
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
    let isAllowedExt = fileExts.includes(path.extname(file.originalname));
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

function clearTemp() {
	const path = require('path');

	const directory = './client/public/uploads/temp';

	fs.readdir(directory, (err, files) => {
	  if (err) throw err;

	  for (const file of files) {
	    fs.unlink(path.join(directory, file), err => {
	      if (err) throw err;
	    });
	  }
	});
}


module.exports = router