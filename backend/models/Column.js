const mongoose = require("mongoose")


const columnSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true
    },
    order: {
        type: Number,
        required: true
    }

}, {timestamps: true})


module.exports = mongoose.model("Column", columnSchema)








