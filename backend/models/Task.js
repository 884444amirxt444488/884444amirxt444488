const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false
    },
    task: {
        type: String,
        required: [true, "task is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: "NONE description"
    },
    completed: {
        type: Boolean,
        default: false
    }

}, {timestamps: true})


module.exports = mongoose.model("Task", taskSchema)









