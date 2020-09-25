const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')


router.get('/', sauceCtrl.getAllSauces);  // afficher toutes les sauces de la base Mongo
router.get('/:id', auth, sauceCtrl.getOneSauce);  // afficher une sauce unique
router.post('/', auth, multer, sauceCtrl.createSauce);  // creer un nouvel objet sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce); // pour mettre a jour l'objet suivant user identifier
router.delete('/:id', auth, sauceCtrl.deleteSauce);  // supprimer la sauce choisie
router.post('/:id/like', auth, sauceCtrl.likeOrDislike); // mise à jour des likes 

module.exports = router;