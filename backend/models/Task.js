const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema({
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
    order: {
        type: Number,
        required: true
    },
    columnId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Column",
        required: true
    }


}, {timestamps: true})



module.exports = mongoose.model("Task", taskSchema)







