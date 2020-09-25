//Plugins :
const express = require('express');
const router = express.Router();

//Controleurs User :
const userCtrl = require('../controllers/user');


const verifyPassword = require('../middleware/verifyPassword');

//Route Users :
router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;