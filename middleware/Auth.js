const jwt = require('jsonwebtoken');
module.exports.isLoggedIn = async(req, res, next) => {
    console.log('cookies',req.cookies);
    try {
        const token  = req.cookies.token;
        console.log('token aaya ??', token);
        if (!token) {   
            console.log('token ni mil rha');
            return res.status(400).json({
                success:false,
                message:"You are not authenticated, Kindly Login first"
            })
        }

        console.log("Token from the auth.js middleware", token);

        const userDetails = await jwt.verify(token, process.env.SECRET);
        req.user = userDetails;
        console.log('req.user is:', req.user);       
        return next();
        
    } catch (e) {
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }
}