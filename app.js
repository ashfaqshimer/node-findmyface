const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');

// Import controllers
const imageController = require('./controllers/image');
const signInController = require('./controllers/signin');
const registerController = require('./controllers/register');
const profileController = require('./controllers/profile');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	}
});

// END POINTS
// /
app.get('/', (req, res) => {
	res.send('API for FindMyFace.');
});

// /signin
app.post('/signin', (req, res) => {
	signInController.handleSignIn(req, res, db);
});

// /register
app.post('/register', (req, res) => {
	registerController.handleRegister(req, res, db);
});

// /image
app.put('/image', (req, res) => {
	imageController.handleImage(req, res, db);
});

// /user/:id
app.get('/user/:id', (req, res) => {
	profileController.getProfile(req, res, db);
});

// SERVER
app.listen(process.env.PORT || 4000, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
