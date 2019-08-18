const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');
const morgan = require('morgan');

// Import controllers
const imageController = require('./controllers/image');
const signInController = require('./controllers/signin');
const registerController = require('./controllers/register');
const profileController = require('./controllers/profile');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Uncomment this block to run on heroku
const db = knex({
	client     : 'pg',
	connection : {
		connectionString : process.env.DATABASE_URL,
		ssl              : true
	}
});

//Database Setup
// const db = knex({
// 	client     : 'pg',
// 	connection : process.env.POSTGRES_URI
// });

// END POINTS
// /
app.get('/', (req, res) => {
	res.send('API for FindMyFace.');
});

// /signin
app.post('/signin', (req, res) => {
	signInController.handleSignIn(req, res, db, bcrypt);
});

// /register
app.post('/register', (req, res) => {
	registerController.handleRegister(req, res, db, bcrypt);
});

// /image
app.put('/image', (req, res) => {
	imageController.handleImage(req, res, db);
});

// /user/:id
app.get('/user/:id', (req, res) => {
	profileController.getProfile(req, res, db);
});
app.post('/user/:id', (req, res) => {
	profileController.postProfile(req, res, db);
});

// SERVER
app.listen(process.env.PORT || 4000, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
