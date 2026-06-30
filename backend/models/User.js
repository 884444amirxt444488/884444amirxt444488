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
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "password must be 8 character"],
        select: false,
        trim: true
    },
    refreshToken: {
        type: String,
        select: false
    },
    code: {
        type: String,
        minlength: [6, "Code must be 6 character"],
        select: false
    },
    codeExpires: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {timestamps: true})



module.exports = mongoose.model("User", userSchema)







