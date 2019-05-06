const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');



//user model 
const User = require('../../modules/utilisateur');


// @route POST api/users
// @desc  Inscription d'un nouveau utilisateur
// @access Public 
router.post('/', (req, res) => {
    const { name, prenom, identifiant, email, password, password_confirmation, Numéros_RPPS, statut, service, hopital }
        = req.body;


    //verifer les champs
    if (!name || !prenom || !identifiant || !email || !password || !password_confirmation || !Numéros_RPPS || !statut || !service || !hopital) {
        return res.status(400).json({ msg: 'Entrez tous les champs' });
    }

    //verfier que les 2 mots de pass sont macth
    if (password != password_confirmation) return res.status(400).json({ msg: 'Votre mot de passe de confirmation ne correspond pas au premier' });


    if (!verifierEmail(email)) return res.status(400).json({ msg: 'Email non valide' });

    //chercher c'est l'email existe deja
    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'Email deja existant' });


            const newUser = new User({
                name,
                prenom,
                identifiant,
                email,
                password,
                Numéros_RPPS,
                statut,
                service,
                hopital
            });




            //creation de salt et hash du password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

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
                        }
                        )

                })
            });


        });



});


function verifierEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// @route POST api/auth 
// @desc  Connexion d'un utilisateur
// @access Public 
router.post('/', (req, res) => {
    const { email, password } = req.body;

    //verifer les champs
    if (!email || !password) {
        return res.status(400).json({ msg: 'Entrez tous les champs' });
    }


    //chercher c'est l'email existe deja
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'Email ou Mot de Pass erroné' });

            //verifier mod de passe
            bcrypt.compare(password, user.Password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Email ou Mot de Pass erroné' })

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

module.exports = router;