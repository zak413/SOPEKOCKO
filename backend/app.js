//Plugin :
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const helmet = require("helmet");
const path = require('path');

//Routes :
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

//Connexion BDD :
mongoose.connect(process.env.BDD_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//Application express :  
const app = express();

// Utilisation de helmet pour masquer le framework 
app.use(helmet());

//Mise en place des headers de requêtes :
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//traitement des données par bodyParser :
app.use(bodyParser.json());

//Mise en place d'un chemin virtuel pour les fichiers statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

//Configuration des Urls routes :
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
 

module.exports = app;








