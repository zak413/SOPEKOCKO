const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');


router.get('/', stuffCtrl.getAllSauces);  // afficher toutes les sauces de la base Mongo
router.get('/:id', stuffCtrl.getOneSauce);  // afficher une sauce unique
router.post('/', stuffCtrl.createSauce);  // creer un nouvel objet sauce
router.put('/:id', stuffCtrl.modifySauce); // pour mettre a jour l'objet suivant user identifier
router.delete('/:id', stuffCtrl.deleteSauce);  // supprimer la sauce choisie
router.post('/:id/like', stuffCtrl.likeOrDislike); // mise à jour des likes et dislikes

module.exports = router;