const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//ceation de schema pour l'utilisateur
const UserSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   prenom: {
      type: String,
      required: true
   },
   identifiant: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true
   },
   Numéros_RPPS: {
      type: Number,
      required: true
   },
   statut: {
      type: String,
      required: true
   }, 
   service: {
      type: String,
      required: true
   },
   hopital: {
      type: String,
      required: true
   }
});

module.exports = User = mongoose.model('user', UserSchema);