const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
    	const token = req.headers.authorization.split(' ')[1]; //Récupération du token
    	const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //le token est vérifié
    	const userId = decodedToken.userId;
	  
	  //Si la requete ne vient pas du bon utilisateurs :
    	if (req.body.userId && req.body.userId !== userId) { 
      		throw 'Invalid user ID';
    	} else {
      		next();
    }
  } 	catch {
    		res.status(401).json({error: new Error('Invalid request!') });
  }
};