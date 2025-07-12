const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.generateToken = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET);
    return token;
}