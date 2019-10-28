const jwt = require('jsonwebtoken');
const constants = require('../tools/constants');

const decodeJWT = (req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.headers.authorization;
        req.locals.participant = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.json({
            success: false,
            message: constants.invalidJWT,
        });
    }
};

module.exports = decodeJWT;
