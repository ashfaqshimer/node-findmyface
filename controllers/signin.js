const bcrypt = require('bcrypt');

const handleSignIn = (req, res, db) => {
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
};

module.exports = { handleSignIn };
