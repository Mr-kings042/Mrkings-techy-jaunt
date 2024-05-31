const jwt = require('jsonwebtoken');
const asynchandler = require('express-async-handler');


const JWTSECRET = process.env.JWTSECRET // JWT Secret Key

const verifyToken = asynchandler(async (req, res, next) => { 
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            error: "Invalid Token"
        });
    }
    token = token.split(' ')[1];
    jwt.verify(token, JWTSECRET, (err, payload) => {
        if (err) {
            return res.status(403).json({
                error: "Invalid Token"
            });
        }
        req.user = payload;
        next();
    });
});
 

module.exports = verifyToken;