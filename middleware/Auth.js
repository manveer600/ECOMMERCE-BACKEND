const jwt = require('jsonwebtoken');
module.exports.isLoggedIn = async(req, res, next) => {
    try {
        const token  = req.cookies.token;
        if (!token) {   
            return res.status(400).json({
                success:false,
                message:"You are not authenticated, Kindly Login first"
            })
        }

        const userDetails = await jwt.verify(token, process.env.SECRET);
        req.user = {...userDetails, token};
        next();
        
    } catch (e) {
        return res.status(400).json({
            success:false,
            message:e.message
        })
    }
}