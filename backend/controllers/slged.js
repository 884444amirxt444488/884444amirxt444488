const {authenciateAccessToken, authenciateRefreshToken} = require("../acv/authenciate")
const User = require("../models/User")
const isValidEmail = require("../acv/verifyEmail")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")



exports.signup = async(req , res) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({message: "Username, email and password are required"})
    }
    if (username.length < 4) {
        return res.status(400).json({message: "Username must be 4 character"})
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "Password must be 8 character at least"})
    }
    try {
        const userExist = await User.findOne({$or: [{username}, {email}]})
        if (userExist) {
            return res.status(409).json({message: "This username or email already exist"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashPassword})
        const payload = {
            _id: newUser._id
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY2, {expiresIn: "7d"})
        newUser.refreshToken = refreshToken
        newUser.save()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(201).json({message: "Signup successfully", accessToken, username: newUser.username, email: newUser.email})
    }
    catch (err) {
        console.error(`Error to signup: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.login = async(req , res) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"})
    } 
    if (username.length < 4) {
        return res.status(400).json({message: "Username must be 4 character"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "Password must be 8 character"})
    }
    try {
        const user = await User.findOne({username}).select("+password")
        if (!user) {
            return res.status(404).json({message: "user not found with this username"})
        }
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(403).json({message: "Incorrect password"})
        }
        const payload = {
            _id: user._id
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY2, {expiresIn: "7d"})
        user.refreshToken = refreshToken
        await user.save()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "Login successfully", username: user.username, email: user.email, accessToken})
    }
    catch (err) {
        console.error("Error to login: ", err)
        res.status(500).json({message: "Error from server. please try ;ater"})
    }
}

exports.getProfile = async(req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: "This user not exist"})
        }
        res.status(200).json({message: "Welcom to my site", username: user.username, email: user.email})
    }
    catch (err) {
        console.error("Error to get profile: ", err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteProfile = async(req, res) => {
    const userId = req.user._id
    try {
        const deleteUser = await User.findByIdAndDelete(userId)
        if (!deleteUser) {
            return res.status(404).json({message: "This user not found"})
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "User deleted successfully"})
    }
    catch (err) {
        console.error(`Error to delete profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editProfile = async(req, res) => {
    const userId = req.user._id
    const {username, email} = req.body
    const listToUpdate = {}
    if (!username && !email) {
        return res.status(400).json({message: "Nothing to update"})
    }
    if (username) {
        if (username.length < 4) {
            return res.status(400).json({message: "Username must be 4 charachter"})
        }
        listToUpdate.username = username
    }
    if (email) {
        if (!isValidEmail(email)) {
            return res.status(400).json({message: "Invalid email format"})
        }
        listToUpdate.email = email
    }
    if (Object.keys(listToUpdate).length === 0) {
        return res.status(400).json({message: "Nothing to be update"})
    }
    try {
        const userExist = await User.findOne({$or: [{username}, {email}]})
        if (userExist) {
            return res.status(409).json({message: "This username or email already exist"})
        }
        const editUser = await User.findByIdAndUpdate(userId, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true 
        })
        if (!editUser) {
            return res.status(404).json({message: "User not found for update"})
        }
        res.status(200).json({message: "User updated successfully", username: editUser.username, email: editUser.email})
    }
    catch (err) {
        console.error("Error to edit profile: ", err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.refreshToken = async(req, res) => {
    const refreshToken = req.cookies.refreshToken
    const userId = req.user._id
    try {
        const user = await User.findById(userId).select("+refreshToken")
        if (!user) {
            return res.status(404).json({message: "This user not found"})
        }
        if (user.refreshToken !== refreshToken) {
            return res.status(403).json({message: "Icorrect refreshToken"})
        }
        const payload = {
            _id: user._id
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "7d"})
        res.status(200).json({message: "Token refreshed", accessToken})
    }
    catch (err) {
        console.error("Error to refreshToken: ", err)
        res.status(500).json({message: "Error from server. plase try later"})
    }
}

exports.editPassword = async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const userId = req.user._id
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({message: "oldPassword, newPassword and confirmPassword are required"})
    }
    if (oldPassword.length < 8) {
        return res.status(400).json({message: "oldPassword must be 8 charachter"})
    }
    if (newPassword.length < 8) {
        return res.status(400).json({message: "newPassword must be 8 charachter"})
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({message: "newPassword not match with confirmPassword"})
    }
    try {
        const user = await User.findById(userId).select("+password")
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
        const isMatchPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isMatchPassword) {
            return res.status(403).json({message: "Icorrect password"})
        }
        const hashNewPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashNewPassword
        await user.save()
        res.status(200).json({message: "Password updated successfully"})
    }
    catch (err) {
        console.error(`Error to edit password: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.forgottenPassword = async(req, res) => {
    const {email} = req.body
    if (!email) {
        return res.status(400).json({message: "Enter your email: "})
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: "This email is not found"})
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const hashCode = await bcrypt.hash(code, 10)
        const codeExpires = Date.now() + 10 * 60 * 1000
        user.code = hashCode
        user.codeExpires = codeExpires
        await user.save()
        
        const transport = await nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        })

        await transport.sendMail({
            from: process.env.user,
            to: email,
            subject: "CODE TO CHANGE PASS",
            html: `
                <h1 style="background: linear-gradient(45deg, blue, black); font-size: 20px; text-align: center; color: white; border-radius: 20px;">Code to change pass</h1>
                <p style="background: yellow; font-size: 20px; text-align: center; color: black; border-radius: 20px;">Do not share this code with anybody</p>
                <h1>Code: ${code}</h1>
                <p>This code valid for 10 min</p>
            `
        })
        res.status(200).json({message: "Code send successfully"})
    }
    catch (err) {
        console.error(`Error to send code: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.changeCode = async(req, res) => {
    const {email, code, newPassword} = req.body
    if (!email || !code || !newPassword) {
        return res.status(400).json({message: "Email, code and newPassword are required"})
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    if (code.length < 6) {
        return res.status(400).json({message: "Code must be 6 character"})
    }
    if (newPassword.length < 8) {
        return res.status(400).json({message: "newPassword must be 8 charachter"})
    }
    try {
        const user = await User.findOne({email}).select("+code +password +codeExpires")
        if (!user) {
            return res.status(404).json({message: "Email not found"})
        }
        if (Date.now() > user.codeExpires) {
            return res.status(403).json({message: "Invalid code. please get code again"})
        }
        if (user.code === null) {
            return res.status(400).json({message: "Please get a code"})
        }
        const isMatchCode = await bcrypt.compare(code, user.code)
        if (!isMatchCode) {
            return res.status(403).json({message: "Icorrect code"})
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        user.code = null
        user.codeExpires = null
        await user.save()
        res.status(200).json({message: "Password changed successfully"})
    }
    catch (err) {
        console.error(`Error to changeCode: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

