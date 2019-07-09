const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const bcrypt = require('bcrypt');

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
	const { email, password } = req.body;
	db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => {
						res.status(400).json('Unable to fetch user');
					});
			}
		});
});

// /register
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password, 10);
	db.transaction(trx => {
		trx
			.insert({ hash, email })
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
						email: loginEmail[0],
						name,
						joined: new Date()
					})
					.then(response => {
						res.json(response[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch(err => {
		res.status(400).json('Unable to register', err);
	});
});

// /image
app.put('/image', (req, res) => {
	const id = req.body.id;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => {
			res.status(400).json('Error getting entries');
		});
});

// /user/:id
app.get('/user/:id', (req, res) => {
	const id = req.params.id;
	db.select('*')
		.from('users')
		.where({ id })
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch(err => {
			res.status(400).json('Error getting user');
		});
});

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
