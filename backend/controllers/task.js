const Task = require("../models/Task")
const User = require("../models/User")
const Column = require("../models/Column")



exports.addTask = async(req, res) => {
    const {columnId} = req.params
    const {task, description} = req.body
    const userId = req.user._id 
    if (!task) {
        return res.status(400).json({message: "Task is required"})
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({message: "User not found"})
        }
        const allOrders = await Task.findOne({columnId}).sort({order: -1})
        const newOrder = allOrders ? allOrders.order + 1 : 1
        const addTask = await Task.create({task, description, order: newOrder, columnId})
        res.status(200).json({message: "Task added", _id: addTask._id, task: addTask.task, description: addTask.description, order: addTask.order})
    }
    catch (err) {
        console.error(`Error to add task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.getTasks = async(req, res) => {
    const {columnId} = req.params
    const userId = req.user._id
    try {
        const column = await Column.findOne({user: userId, _id: columnId})
        if (!column) {
            return res.status(401).json({message: "Nothing to send"})
        }
        const getTasks = await Task.find({columnId}).sort({order: 1})
        res.status(200).json({message: "Tasks send", getTasks})
    }
    catch (err) {
        console.error(`Error to get tasks: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editTask = async(req, res) => {
    const {task, description, completed, columnId} = req.body
    const {taskId} = req.params
    const userId = req.user._id
    const listToUpdate = {}
    if (task) {
        listToUpdate.task = task
    }
    if (description) {
        listToUpdate.description = description
    }
    if (completed !== undefined) {
        listToUpdate.completed = completed
    }
    if (Object.keys(listToUpdate).length === 0) {
        return res.status(400).json({message: "Nothing to update"})
    }
    try {
        const columnExist = await Column.findOne({user: userId, _id: columnId})
        if (!columnExist) {
            return res.status(401).json({message: "Column not found"})
        }
        const editTask = await Task.findOneAndUpdate({columnId, _id: taskId}, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true
        })
        if (!editTask) {
            return res.status(401).json({message: "Task not found for edit"})
        }
        res.status(200).json({message: "Task updated successfully", editTask})
    }
    catch (err) {
        console.error(`Error to edit task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteTask = async(req, res) => {
    const {taskId} = req.params
    const {columnId} = req.body
    const userId = req.user._id

    try {
        const column = await Column.findOne({user: userId, _id: columnId})
        if (!column) {
            return res.status(404).json({message: "Column not found for this user"})
        }
        const deleteTask = await Task.findOneAndDelete({_id: taskId, columnId})
        if (!deleteTask) {
            return res.status(404).json({message: "Task not found for delete"})
        }
        await Task.updateMany({columnId, order: {$gt: deleteTask.order}}, {$inc: {order: -1}})
        res.status(200).json({message: "Task deleted"})
    }
    catch (err) {
        console.error(`Error to delete task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteAllTasks = async(req, res) => {
    const {columnId} = req.params
    const userId = req.user._id
    try {
        const user = await Column.findOne({user: userId, _id: columnId})
        if (!user) {
            return res.status(401).json({message: "user not found"})
        }
        await Task.deleteMany({columnId})
        res.status(200).json({message: "All tasks deleted"})
    }
    catch (err) {
        console.error(`Error to delete all tasks: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}








