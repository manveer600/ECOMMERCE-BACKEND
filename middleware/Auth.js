const jwt = require('jsonwebtoken');
module.exports.isLoggedIn = async (req, res, next) => {
    try {
        const findingToken = Date.now();
        const token = req.cookies.token;
        console.log('finding token', Date.now() - findingToken, "ms");
        console.log('token not found');
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "You are not authenticated, Kindly Login first"
            })
        }
        const verifyStart = Date.now();
        const userDetails = await jwt.verify(token, process.env.SECRET);
        console.log('Time taken for JWT verification:', Date.now() - verifyStart, 'ms');
        req.user = { ...userDetails, token };
        next();

    } catch (e) {
        return res.status(400).json({
            success: false,
            message: e.message
        })
    }
}