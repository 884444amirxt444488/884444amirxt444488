const mongoose = require("mongoose")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true,
        minlength: [4, "Username must be 4 character"]
    },
    email: {
        type: String,
        required: [true, "username is required"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 character"],
        trim: true,
        select: false 
    },
    refreshToken: {
        type: String,
        select: false
    },
    code: {
        type: String,
        select: false
    },
    expiresCode: {
        type: Date,
        default: Date.now,
        select: false
    },
    numberToTrye: {
        type: Number,
        default: 0,
        select: false
    }

}, {timestamps: true})


module.exports = mongoose.model("User", userSchema)








