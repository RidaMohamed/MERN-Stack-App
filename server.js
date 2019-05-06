const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const config = require('config');


const app = express();

// Bodyparser Niddleware
app.use(express.json());


// DB Configuration
const db = config.get('mongoURI');


// Connexion a DBMongo
mongoose
   .connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true
   })
   .then(() => console.log('Connexion a MongoDB reussie!!'))
   .catch(err => console.log(err));

// Utiliser routes
app.use('/api/items',require('./routes/api/items'));
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));


const port = process.env.PORT || 5000;
// Se mettre en ecoute sur ce port
app.listen(port, () => console.log(`Serveur lancé sur le port ${port}`));