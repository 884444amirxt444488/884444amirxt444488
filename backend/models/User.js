const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minlength: [4, "username must be 4 character"],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        requried: [true, "password is required"],
        minlength: [8, "password must be 8 character"],
        select: false
    },
    refreshToken: {
        type: String,
        select: false
    }

}, {timestamps: true})




module.exports = mongoose.model("User", userSchema)







