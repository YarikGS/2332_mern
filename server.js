const express = require('express')
const config = require('config')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express()

app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

// Initialize CORS middleware
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// process.env.S3_KEY,

// const fs = require('fs');
// const dir = './client/public/uploads';

// if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir)
//     fs.mkdirSync(dir+'/temp')
//     fs.mkdirSync(dir+'/slider')
//     fs.mkdirSync(dir+'/team')
// }

// app.use(express.static('./client/public/uploads'))

app.use(express.json({ extended: true }))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/gallery', require('./routes/gallery.routes'))
app.use('/api/gallery_category', require('./routes/gallery_category.routes'))
app.use('/api/slider', require('./routes/slider.routes'))
app.use('/api/team', require('./routes/team.routes'))


if (process.env.NODE_ENV === 'production'){
	app.use(express.static('client/build')) 
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

 
// const PORT = config.get('port') || 5000
const PORT = process.env.PORT || 5000;

async function start()
{
	try{
		mongoose.set('useCreateIndex', true);
		mongoose.set('useFindAndModify', false);
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
