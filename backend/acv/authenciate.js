const jwt = require("jsonwebtoken")

const authenciateAccessToken = async(req , res, next) => {
    const authHeader = req.headers.authorization
    const accessToken = authHeader && authHeader.split(" ")[1]
    if (!accessToken) {
        return res.status(400).json({message: "AccessToken is required"})
    }
    jwt.verify(accessToken, process.env.SUPER_SECRET_KEY, (err, userInfo) => {
        if (err) {
            return res.status(401).json({message: "Invalid login", code: "INVALID_ACCESSTOKEN"})
        }
        req.user = userInfo
        next()
    })
} 


const authenciateRefreshToken = async(req , res, next) => {
    const {refreshToken} = req.cookies
    if (!refreshToken) {
        return res.status(400).json({message: "RefreshToken is required"})
    }
    jwt.verify(refreshToken, process.env.SUPER_SECRET_KEY2, (err, userInfo) => {
        if (err) {
            return res.status(401).json({message: "Invalid login", code: "INVALID_REFRESHTOKEN"})
        }
        req.user = userInfo
        next()
    })
}




module.exports = {authenciateAccessToken, authenciateRefreshToken}




