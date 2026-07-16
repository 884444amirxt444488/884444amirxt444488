const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const isValidEmail = require("../acv/verifyEmail")
const User = require("../models/User")
const Column = require("../models/Column")
const Task = require("../models/Task")
const nodeEmailer = require("nodemailer")




exports.signup = async(req , res) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({message: "Username and email and password are required"})
    }
    if (username.length < 4) {
        return res.status(400).json({message: "Username must be 4 character"})
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "password must be 8 character"})
    }
    try {
        const userExist = await User.findOne({$or: [{username}, {email}]})
        if (userExist) {
            return res.status(409).json({message: "Username or email already exist"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashPassword})
        const payload = {
            _id: newUser._id 
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        const refreshToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY2, {expiresIn: "7d"})
        newUser.refreshToken = refreshToken
        await newUser.save()
        await Column.insertMany([
            {
                user: newUser._id,
                title: "ToDo",
                order: 1
            },
            {
                user: newUser._id,
                title: "Doing",
                order: 2
            },
            {
                user: newUser._id,
                title: "Done",
                order: 3
            }
        ])
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            //به دلیل اینکه روی هاست و برای تست
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000

        }).status(201).json({message: "Signup successfully", username: newUser.username, email: newUser.email, accessToken})
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
        return res.status(400).json({message: "Username must be 4 character"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "Password must be 8 character"})
    }
    try {
        const user = await User.findOne({username}).select("+password")
        if (!user) {
            return res.status(401).json({message: "incorrect username or password"})
        }
        const isMatchPassword = await bcrypt.compare(password, user.password)
        if (!isMatchPassword) {
            return res.status(401).json({message: "incorrect username or password"})
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
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({message: "Login successfully", accessToken, username: user.username, email: user.email})
    }
    catch (err) {
        console.error(`Error to login: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.getProfile = async(req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId).select("-_id -code -expiresCode")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.json(user)
    }
    catch (err) {
        console.error(`Error to get prfile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteProfile = async(req, res) => {
    const userId = req.user._id
    try {
        const allColumns = await Column.find({user: userId})
        const allColumnsId = allColumns.map(item => item._id)
        await Task.deleteMany({columnId: {$in: allColumnsId}})
        await Column.deleteMany({user: userId})
        const deleteUser = await User.findByIdAndDelete(userId)
        if (!deleteUser) {
            return res.status(404).json({message: "User not found"})
        }
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        }).status(200).json({message: "User deleted"})
    }
    catch (err) {
        console.error(`Error to delete profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editProfile = async(req, res) => {
    const {username, email} = req.body
    const userId = req.user._id
    const listToUpdate = {}
    if (username) {
        if (username.length < 4) {
            return res.status(400).json({message: "Username must be 4 character"})
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
        return res.status(400).json({message: "Nothing to edit. enter your new username or email"})
    }

    try {
        const user = await User.findOne({$or: [{username}, {email}], _id: {$ne: userId}})
        if (user) {
            return res.status(409).json({message: "This username or email already exist"})
        }
        const editUser = await User.findByIdAndUpdate(userId, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true
        })
        if (!editUser) {
            return res.status(404).json({message: "User do not exist"})
        }
        res.status(200).json({message: "Your informations updated successfuly", username: editUser.username, email: editUser.email})
    }
    catch (err) {
        console.error(`Error to edit profile: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.refreshToken = async(req, res) => {
    const {refreshToken} = req.cookies
    const userId = req.user._id
    if (!refreshToken) {
        return res.status(400).json({message: "RefreshToken is required"})
    }
    try {
        const user = await User.findById(userId).select("+refreshToken")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        if (refreshToken !== user.refreshToken) {
            return res.status(401).json({message: "Invalid login. login again"})
        }
        const payload = {
            _id: user._id
        }
        const accessToken = jwt.sign(payload, process.env.SUPER_SECRET_KEY, {expiresIn: "15m"})
        res.status(200).json({accessToken})
    }
    catch (err) {
        console.error(`Error to refreshToken: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.getCode = async(req, res) => {
    const {email} = req.body
    if (!email) {
        return res.status(400).json({message: "Email is required"})
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({message: "Invalid email format"})
    }
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: "Incorrect email"})
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const newDate = Date.now() + 10 * 60 * 1000
        const hashCode = await bcrypt.hash(code, 10)
        user.code = hashCode
        user.expiresCode = newDate
        await user.save()

        const transport = nodeEmailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        })
        await transport.sendMail({
            from: process.env.user,
            to:email,
            subject: "Code",
            html: `
                <h1 style="background: linear-gradient(
                    45deg,
                    rgb(0, 0, 98),
                    rgb(104, 0, 0)
                );
                color: white;
                text-align: center;
                margin: 10px;
                border-radius: 20px;
                border: 2px solid rgb(74, 74, 74);
                padding: 5px;"
                >Hello my friend</h1>
                <div style="margin: 10px auto;
                    border: 2px solid blue;
                    max-width: 600px;
                    border-radius: 30px;
                    border-bottom: none;
                    border-top: none;"
                >
                    <h2 style="background-color: rgb(255, 255, 255);
                    color: rgb(0, 0, 0);
                    text-align: center;
                    margin: 10px auto;
                    border-radius: 20px;
                    padding: 20px;
                    max-width: 500px;"
                    >code to change your password. remember this code is so important so do not share this code with any body. this code expires in 10 min</h2>
                    <h3 style="background-color: rgb(255, 255, 255);
                    color: rgb(24, 119, 0);
                    text-align: center;
                    margin: 10px auto;
                    border-radius: 20px;
                    padding: 20px;
                    max-width: 500px;
                    border-top: 2px solid blue;
                    border-bottom: 2px solid blue;"
                    >Code: ${code}</h3>
                    <h4 style="background-color: rgb(255, 255, 255);
                    color: rgb(0, 0, 0);
                    text-align: center;
                    margin: 40px auto;
                    border-radius: 20px;
                    padding: 20px;
                    max-width: 500px;"
                    >Come back to change your pass.<a style="margin-left: 5px;
                    font-size: bold;
                    text-decoration: none;
                    background-color: black;
                    color: white;
                    padding: 10px;
                    border-radius: 30px;
                    display:block;
                    "
                    href="http://localhost:3000/changePassword" target="_blank"> Back to site</a></h4>
                </div>
            `
        })
        return res.status(200).json({message: "Code send"})
    }
    catch (err) {
        console.error(`Error to send code: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.changePassowrd = async(req, res) => {
    const {email, code, password} = req.body
    if (!email || !code || !password) {
        return res.status(400).json({message: "code and password are required"})
    }
    if (password.length < 8) {
        return res.status(400).json({message: "Password must be 8 character"})
    }
    try {
        const user = await User.findOne({email}).select("+code +expiresCode")
        if (user.numberToTrye > 10) {
            user.code = null
            user.expiresCode = null
            user.numberToTrye = 0
            await user.save()
            return res.status(401).json({message: "So many try. get code again"})
        }
        if (Date.now() > user.expiresCode) {
            user.code = null
            user.expiresCode = null
            await user.save()
            return res.status(401).json({message: "Code is expired"})
        }
        if (user.code === null) {
            return res.status(400).json({message: "Code not exist. get code again"})
        }
        const isMatchCode = await bcrypt.compare(code, user.code)
        if (!isMatchCode) {
            user.numberToTrye = user.numberToTrye + 1
            await user.save()
            return res.status(401).json({message: "Incorrect code"})
        }
        const hashPassword = await bcrypt.hash(password, 10)
        user.password = hashPassword
        user.code = null
        user.expiresCode = null
        user.numberToTrye = 0
        user.refreshToken = null
        await user.save()
        res.status(200).json({message: "Password changed successfully"})
    }
    catch (err) {
        console.error(`Error to change password: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editPassword = async(req, res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body
    const userId = req.user._id
    if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({message: "OldPassword, newPassword and confirmPassword are required"})
    }
    if (oldPassword.length < 8 || newPassword.length < 8) {
        return res.status(400).json({message: "Passwords must be 8 character"})
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({message: "Confirm password not match"})
    }
    try {
        const user = await User.findById(userId).select("+password")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const isMatchPassword = await bcrypt.compare(oldPassword, user.password) 
        if (!isMatchPassword) {
            return res.status(403).json({message: "Incorrect passsword"})
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashPassword
        await user.save()
        res.status(200).json({message: "Password changed successfully"})
    }
    catch (err) {
        console.error(`Error to change password: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteCookie = async(req, res) => {
    const userId = req.user._id
    try {
        const user = await User.findById(userId).select("+refreshToken")
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        user.refreshToken = ""
        await user.save()
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict"
        }).json({message: "Logout successfully"})
    }
    catch (err) {
        console.error(`Error to logout: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}