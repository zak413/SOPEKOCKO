const passwordSchema = require('../models/Password');

module.exports = (req, res, next) => {
	if (!passwordSchema.validate(req.body.password)) {
		return res.status(400).send('Mot de passe faible !');
	} else {
		next();
	}
};