const jwt = require('jsonwebtoken');

//Verificar Token
let verifyToken = (req, res, next) => {

    let token = req.get('token'); //token

    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        next();
    });
};

module.exports = verifyToken;