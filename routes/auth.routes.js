const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// api/auth/force
// router.get(
// 	'/force',
// 	async (req, res)=>{
// 		try{
//
// 			// const { email, username, password, confirm_password } = req.body
//
// 			const email = '2332films'
// 			const username = '2332films admin'
// 			const password = 'shootordie'
// 			const candidate = await User.findOne({email})
//
// 			if (candidate) {
// 				return res.status(400).json({message: 'User already exists'})
// 			}
//
// 			console.log('password:',password)
//
// 			const hashedPassword = await bcrypt.hash(password, 12)
//
// 			const user = new User({email, password: hashedPassword, username})
//
// 			await user.save()
// 			console.log('new user', user);
// 			res.status(201).json({message: 'User created'})
//
// 		} catch(e){
// 			console.log('err', e);
// 			res.status(500).json({ message: e })
// 		}
// 	}
// )

// // api/auth/register
// router.post(
// 	'/register',
// 	[
// 		check('email', 'Email is invalid').isEmail(),
// 		check('password', 'Password minimum length is 6').isLength({ min: 6 }),
// 		check('username', 'Invalid characters').isAlpha()
// 	],
// 	async (req, res)=>{
// 		try{
// 			// console.log('Body:',req.body)
// 			const errors =  validationResult(req)
//
// 			if ( !errors.isEmpty() ) {
// 				return res.status(400).json({
// 					errors: errors.array(),
// 					message: 'Data validation error'
// 				})
// 			}
//
// 			const { email, username, password, confirm_password } = req.body
//
// 			const candidate = await User.findOne({email})
//
// 			if (candidate) {
// 				return res.status(400).json({message: 'User already exists'})
// 			}
//
// 			console.log('password:',password)
// 			console.log('confirm_password:',confirm_password)
// 			if (confirm_password !== password ) {
// 				return res.status(400).json({message: 'Passwords are not equal'})
// 			}
// 			const hashedPassword = await bcrypt.hash(password, 12)
//
// 			const user = new User({email, password: hashedPassword, username})
//
// 			await user.save()
//
// 			res.status(201).json({message: 'User created'})
//
// 		} catch(e){
// 			res.status(500).json({ message: e })
// 		}
// 	}
// )

// api/auth/login
router.post(
	'/login',
	[
		// check('email', 'Email is invalid').isEmail(),
		check('email', 'Login minimum length is 2').isLength({ min: 2 }),
		check('password', 'Password minimum length is 6').isLength({ min: 6 }),
	],
	async (req, res)=>{
	 	try{

			const errors =  validationResult(req)

			if ( !errors.isEmpty() ) {
				return res.status(400).json({
					errors: errors.array(),
					message: 'Data validation error'
				})
			}

			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user) {
				return res.status(400).json({message: 'User not found'})
			}

			const isMatch = await bcrypt.compare(password, user.password)

			if (!isMatch) {
				return res.status(400).json({message: 'Wrong data'})
			}

			const token = jwt.sign(
				{ userId: user.id },
				config.get('jwtToken'),
				{ expiresIn: '2h' }
			)

			jwt.verify(token, config.get('jwtToken'), (err, decoded_data) => {
	      if (err) return res.status(401).send({error:err})
	      req.auth_user = decoded_data
	    });

			console.log('Body username:', user.username)
			res.json({ token, userId: user.id, username:user.username, exp: req.auth_user.exp })

		} catch(e){
			res.status(500).json({ message: e })
		}
	}
)

module.exports = router
