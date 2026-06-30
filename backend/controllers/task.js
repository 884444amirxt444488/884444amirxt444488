const Task = require("../models/Task")

exports.addTask = async(req, res) => {
    const {task, description, dateToFinish} = req.body
    const userId = req.user._id
    if (!task) {
        return res.status(400).json({message: "task is required"})
    }
    try {   
        const newTask = await Task.create({user: userId, task, description, dateToFinish})
        res.status(200).json({message: "Task added successfully", _id: newTask._id, task: newTask.task, description: newTask.description, dateToFinish: newTask.dateToFinish})
    }
    catch (err) {
        console.error(`Error to add task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.getTasks = async(req, res) => {
    const userId = req.user._id
    try {
        const tasks = await Task.find({user: userId}).select("task description completed dateToFinish")
        if (!tasks) {
            return res.status(404).json({message: "User do not have tasks"})
        }
        res.status(200).json({tasks})
    }
    catch (err) {
        console.error(`Error to getTasks: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteTask = async(req, res) => {
    const taskId = req.params.id 
    const userId = req.user._id
    try {
        const taskToDelete = await Task.findOneAndDelete({user: userId, _id: taskId})
        if (!taskToDelete) {
            return res.status(404).json({message: "Task not found"})
        }
        res.status(200).json({message: "Task deleted successfully"})
    }
    catch (err) {
        console.error(`Error to delete task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteAllTasks = async(req, res) => {
    const userId = req.user._id
    try {
        const deleteTasks = await Task.deleteMany({user: userId})
        if (deleteTasks.deletedCount === 0) {
            return res.status(404).json({message: "Tasks not found to delete"})
        }
        res.status(200).json({message: "Tasks deleted successfully"})
    }
    catch (err) {
        console.error(`Error to deleteAllTasks: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editTask = async(req, res) => {
    const {task, description, dateToFinish, completed} = req.body
    const userId = req.user._id
    const taskId = req.params.id

    const listToUpdate = {}
    if (!task && !description && !dateToFinish && completed === undefined) {
        return res.status(400).json({message: "Send somthing to update"})
    }
    if (task) {
        listToUpdate.task = task
    }
    if (description) {
        listToUpdate.description = description
    }
    if (dateToFinish) {
        listToUpdate.dateToFinish = dateToFinish
    }
    if (completed !== undefined) {
        listToUpdate.completed = completed
    }
    if (Object.keys(listToUpdate).length === 0) {
        return res.status(400).json({message: "Nothing to update"})
    }

    try {
        const editTask = await Task.findOneAndUpdate({user: userId, _id: taskId}, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true
        })
        if (!editTask) {
            return res.status(404).json({message: "Nothing found to update"})
        }
        res.status(200).json({message: "Task updated successfully", task: editTask, description: editTask.description, completed: editTask.completed, dateToFinish: editTask.dateToFinish})
    }
    catch (err) {
        console.error(`Error to edit task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}








