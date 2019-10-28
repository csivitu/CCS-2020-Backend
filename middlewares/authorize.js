const jwt = require('jsonwebtoken');
const constants = require('../tools/constants');

const decodeJWT = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            message: constants.invalidJWT,
        });

        return;
    }

    try {
        req.participant = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: constants.invalidJWT,
        });
    }
};

module.exports = decodeJWT;
