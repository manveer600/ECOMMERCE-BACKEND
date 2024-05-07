const jwt = require('jsonwebtoken');
module.exports = async function createJwtToken(id,email) {
    const token = await jwt.sign({
        id: id,
        email: email
    }, process.env.SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    })

    return token;
}