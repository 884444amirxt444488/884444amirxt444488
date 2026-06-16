const User = require("../models/User")
const Task = require("../models/Task")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const isValidemail = require("../acv/verifyEmail")
const isVerifyEmail = require("../acv/verifyEmail")



exports.signup = async(req, res) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({message: "Username, email and password are required"})
    }
    if (username.length < 4) {
        return res.status(400).json({message: "Username must be 4 character"})
    }
    if (!isVerifyEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "Password must be 8 character"})
    }
    try {
        const userExist = await User.findOne({$or: [{username}, {email}]})
        if (userExist) {
            return res.status(409).json({message: "This username or email already exist"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashPassword})
        const payload = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY2, {expiresIn: "7d"})
        newUser.refreshToken = refreshToken
        await newUser.save()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(201).json({message: "Signup successfully", accessToken})
    }
    catch (err) {
        console.error(`Error to signup: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.login = async(req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"})
    }
    if (username.length < 4) {
        return res.status(400).json({message: "username must be 4 character"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "password must be 8 character"})
    }
    try {
        const user = await User.findOne({username}).select("+password")
        if (!user) {
            return res.status(404).json({message: "User with this username is not found"})
        }
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(403).json({message: "Incorrect password"})
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY2, {expiresIn: "7d"})
        user.refreshToken = refreshToken
        await user.save()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "Login successfully", accessToken})
    }
    catch (err) {
        console.error(`Error to login: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.getProfile = async(req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.json({message: "Welcom to my site", username: user.username, email: user.email})
    }
    catch (err) {
        console.error(`Error to get profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.deleteProfile = async(req, res) => {
    const userId = req.user.id
    try {
        await Task.deleteMany({user: userId})
        const userToDelete = await User.findByIdAndDelete(userId)
        if (!userToDelete) {
            return res.status(404).json({message: "This user not exist"})
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "User deleted successfully"})
    }
    catch (err) {
        console.error(`Error to delete profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.editProfile = async(req, res) => {
    const userId = req.user.id
    const {username, email} = req.body
    if (!username && !email) {
        return res.status(400).json({message: "send one req to edit"})
    }
    const listToUpdate = {}
    if (username) {
        if (username.length < 4) {
            return res.status(400).json({message: "Username must be 4 charcter"})
        }
        listToUpdate.username = username
    }
    if (email) {
        if (!isValidemail(email)) {
            return res.status(400).json({message: "Invalid email format"})
        }
        listToUpdate.email = email
    }
    if (listToUpdate.length === 0) {
        return res.status(400).json({message: "Nothing to edit"})
    }
    try {
        const user = await User.findOne({$or: [{username}, {email}]})
        if (user) {
            return res.status(409).json({message: "This username or email already exist."})
        }
        const userToUpdate = await User.findByIdAndUpdate(userId, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true
        })
        if (!userToUpdate) {
            return res.status(404).json({message: "user not found for update"})
        }
        res.status(200).json({message: "User updated successfully", username: userToUpdate.username, email: userToUpdate.email})
    }
    catch (err) {
        console.error(`Error to edit profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.refreshToken = async(req, res) => {
    const {refreshToken} = req.cookies
    const userId = req.user.id
    if (!refreshToken) {
        return res.status(400).json({message: "refreshToken is required"})
    }
    try {
        const user = await User.findById(userId).select("+refreshToken")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({message: "Invalid login"})
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        res.status(200).json({message: "refreshToken send", accessToken})
    }
    catch (err) {
        console.error(`Error to refreshToken: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.logout = async(req, res) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }).status(200).json({message: "logedout"})
    }
    catch (err) {
        console.error(`Error to logout: `, err)
        res.status(500).json({message: "Error tfrom server. please try later"})
    }
}


