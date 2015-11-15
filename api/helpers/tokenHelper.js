const User = require('./../models/user');

module.exports = {

	isValid(token) {
		return new Promise((resolve, reject) => {
			User.findOne({token}).select('token').then(function (user) {
				if (!user) {
					reject();
				} else {
					resolve();
				}
			}, function (err) {
				reject();
			});
		});
	}
}