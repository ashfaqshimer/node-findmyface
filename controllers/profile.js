const getProfile = (req, res, db) => {
	const id = req.params.id;
	db
		.select('*')
		.from('users')
		.where({ id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch((err) => {
			res.status(400).json('Error getting user');
		});
};

const postProfile = (req, res, db) => {
	const { id } = req.params;
	const { name } = req.body.formInput;
	db('users')
		.where({ id })
		.update({ name })
		.then((response) => {
			if (response) {
				res.json('success');
			} else {
				res.status(400).json('unable to update');
			}
		})
		.catch((err) => {
			res.status(400).json('error updating user');
		});
};

module.exports = { getProfile, postProfile };
