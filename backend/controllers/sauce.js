const Sauce = require('../models/sauce');
const fs = require('fs'); // plugin


// création de sauce
exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
    sauceObject.likes = 0; 
    sauceObject.dislikes = 0;
    sauceObject.usersLiked = Array(); 
    sauceObject.usersDisliked = Array(); 
	
	const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});
// sauvegarde de la sauce
	sauce.save().then(
		() => {
			res.status(201).json({
				message: 'Sauce créée.'
			});
		}
	).catch(
		(error) => {
			res.status(400).json({
				error: error
			});
		}
	);
};

// récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
		.then((sauce) => {res.status(200).json(sauce);})
		.catch(
		(error) => {
			res.status(404).json({
				error: error
			});
		}
	);
};


// modification d'une sauce existante
exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file ? // on crée l'objet sauceObject et on utilise l'opérateur ternaire "? {} : {}" pour savoir si req.file existe (si l'image existe)
		  { // si le fichier existe
			  ...JSON.parse(req.body.sauce), // on fait comme pour la route POST
			  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		  } : { ...req.body };  // si req.file n'existe pas, on envoi simplement les éléments
	if (req.file) {
		Sauce.findOne({ _id: req.params.id })
			.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {// suppression de l'image à remplacer
				Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //mise à jour d'une sauce
				.then(() => res.status(200).json({ message: 'Sauce et image modifiée' }))
				.catch(error => res.status(400).json({ error }));
			});
		}).catch(error => res.status(400).json({ error }))
	} else {
		Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) //mise à jour d'une sauce
		.then(() => res.status(200).json({ message: 'Sauce modifiée' }))
		.catch(error => res.status(400).json({ error }));
  }
};


// supression d'une sauce
exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
		const filename = sauce.imageUrl.split('/images/')[1];
		fs.unlink(`images/${filename}`, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
			.catch(error => res.status(400).json({ error }));
		});
	})
    .catch(error => res.status(500).json({ error }));
};


// gestion des likes
exports.likeOrDislike = (req, res, next) => {
	if(req.body.like === 1){
		Sauce.updateOne({ _id: req.params.id },  {$inc: {likes: req.body.like++} ,$push: {usersLiked: req.body.userId}})
        .then ((sauce)=> res.status(200).json({ message: 'Un like de plus !'}))
        .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1){
        Sauce.updateOne({ _id: req.params.id },  {$inc: {dislikes: (req.body.like++)*-1} ,$push: {usersDisliked: req.body.userId}})
        .then ((sauce)=> res.status(200).json({ message: 'Un dislike de plus !'}))
        .catch(error => res.status(400).json({ error }));
    } else { 
        
		Sauce.findOne({_id: req.params.id})
			.then(sauce => {
				if (sauce.usersLiked.includes(req.body.userId)) {
					Sauce.updateOne({_id: req.params.id}, {$pull: {usersLiked: req.body.userId}, $inc: {likes: -1}})
                    	.then((sauce) => {res.status(200).json({ message: 'Un like de moins !'})}) 
                    	.catch(error => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({_id: req.params.id}, {$pull: {usersDisliked: req.body.userId}, $inc: {dislikes: -1}})
                    	.then((sauce) => {res.status(200).json({ message: 'Un dislike de moins !'})}) 
                    	.catch(error => res.status(400).json({ error }))  
                }
            })
            .catch(error => res.status(400).json({ error }));
    }
};


// récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
	Sauce.find().then(
		(sauces) => {
			res.status(200).json(sauces);
    	}
  		).catch(
    		(error) => {
				res.status(400).json({
					error: error
				});
			}
	);
};