const express = require("express")
const router = express.Router()
const userController = require("../controllers/slged")
const {authenciateAccessToken, authenciateRefreshToken} = require("../acv/authenciate")

router.post("/signup", userController.signup)
router.post("/login", userController.login)
router.get("/getProfile", authenciateAccessToken, userController.getProfile)
router.delete("/deleteProfile", authenciateAccessToken, userController.deleteProfile)
router.patch("/editProfile", authenciateAccessToken, userController.editProfile)
router.post("/refreshToken", authenciateRefreshToken, userController.refreshToken)
router.post("/logout", userController.logout)




module.exports = router
