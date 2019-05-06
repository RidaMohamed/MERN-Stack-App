const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../modules/utilisateur');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');


// @route POST api/auth 
// @desc  Connexion d'un utilisateur
// @access Public 
router.post('/', (req, res) => {

    
    const { identifiant, password } = req.body;

    //verifer les champs
    if (!identifiant || !password) {
        return res.status(400).json({ msg: 'Entrez tous les champs' });
    }


    //chercher c'est l'email existe deja
    User.findOne({ identifiant })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'Identifiant ou Mot de Pass erroné' });

            //verifier mod de passe
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Identifiant ou Mot de Pass erroné' })

                    jwt.sign(
                        { id: user.id },
                        config.get('jwtSecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        });

                })

        });



});



// @route GET api/auth/user
// @desc  Recuperer les donnees d'un utilisateur
// @access Private
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user));
  });


module.exports = router;