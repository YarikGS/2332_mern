const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors');

const app = express()

app.use(express.json({ extended: true }))
// app.use(
//   cors({
//     credentials: true,
//     origin: ["https://sheltered-headland-76340.herokuapp.com:3000"],
//     optionsSuccessStatus: 200
//   })
// );
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/gallery', require('./routes/gallery.routes'))

if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build')) 
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}
 
// const PORT = config.get('port') || 5000
const PORT = process.env.PORT || 8080;

async function start()
{
	try{
		mongoose.set('useCreateIndex', true);
		await mongoose.connect(process.env.MONGODB_URI || config.get('mongoUri'), {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})

		app.listen(PORT, ()=> console.log(`server app running on port ${PORT}`))

	} catch(e) {
		console.log(`Server error`, e.message)
		process.exit(1)
	}
}

start()
