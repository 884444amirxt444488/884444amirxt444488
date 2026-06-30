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
        required: [true, "Task is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        lowercase: true,
        default: "None description"
    },
    completed: {
        type: Boolean,
        default: false
    },
    dateToFinish: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true})


module.exports = mongoose.model("Task", taskSchema)








