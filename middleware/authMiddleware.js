const jwt = require('jsonwebtoken')
const {secret} = require('../config/config');

exports.authMiddleware = (req, res, next) =>{
    try {

        const token = req.headers.authentication;
        if (!token) {
            return res.status(403).json({message: "User not found"});
        };
        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch (e) {
        console.log(e);
        return res.status(403).json({message: "User not logined"});
    }
};