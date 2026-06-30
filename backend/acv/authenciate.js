const jwt = require("jsonwebtoken")

const authenciateAccessToken = (req , res , next) => {
    const authHeader = req.headers.authorization
    const accessToken = authHeader && authHeader.split(" ")[1]
    if (!accessToken) {
        return res.status(400).json({message: "AccessToken not send"})
    }
    jwt.verify(accessToken, process.env.SUPER_SECRET_KEY, (err, userInfo) => {
        if (err) {
            return res.status(401).json({message: "Invalid accessToken", code: "INVALID_ACCESSTOKEN"})
        }
        req.user = userInfo
        next()
    })
}


const authenciateRefreshToken = (req, res, next) => {
    const authCookie = req.cookies.refreshToken
    if (!authCookie) {
        return res.status(400).json({message: "RefreshToken is required"})
    } 
    jwt.verify(authCookie, process.env.SUPER_SECRET_KEY2, (err, userInfo) => {
        if (err) {
            return res.status(401).json({message: "Invalid refreshToken", code: "INVALID_REFRESHTOKEN"})
        }
        req.user = userInfo
        next()
    })
}



module.exports = {authenciateAccessToken, authenciateRefreshToken}





