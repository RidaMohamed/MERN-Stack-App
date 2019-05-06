const config = require('config');
const jwt = require('jsonwebtoken');


function auth(req, res, next) {

    const token = req.header('x-auth-token');

    // verfier token
    if (!token)
        return res.status(401).json({ msg: 'Pas de token, authorization denied'});

    try {
        // Verfier le token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Ajouter user 
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token non valid' });
    }

}


module.exports = auth;