const Task = require("../models/Task")



exports.addTask = async(req, res) => {
    const {task, description} = req.body
    const userId = req.user.id 
    if (!task) {
        return res.status(400).json({message: "Task is required"})
    }
    try {
        const newTask =  await Task.create({user: userId, task, description})
        res.status(201).json({message: "Task added successfully", task: {
            _id: newTask._id,
            task: newTask.task,
            description: newTask.description,
            completed: newTask.completed
        }})
    }
    catch (err) {
        console.error(`Error to add task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.getTasks = async(req, res) => {
    const taskId = req.params.id
    const userId = req.user.id
    try {
        const tasks = await Task.find({user: userId})
        if (tasks.length === 0) {
            return res.status(404).json({message: "no tasks"})
        }
        res.status(200).json({message: "tasks send", tasks})
    }
    catch (err) {
        console.error(`Error to get tasks: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.deleteTask = async(req, res) => {
    const taskId = req.params.id
    const userId = req.user.id
    try {
        const deleteTask = await Task.findOneAndDelete({_id: taskId, user: userId})
        if (!deleteTask) {
            return res.status(404).json({message: "Not exist tasks"})
        }
        res.status(200).json({message: "Task deleted"})
    }
    catch (err) {
        console.error(`Error to delete task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}
exports.editTask = async(req, res) => {
    const userId = req.user.id
    const taskId = req.params.id
    const {task, description, completed} = req.body
    if (task === undefined && description === undefined && completed === undefined) {
        return res.status(400).json({message: "send on req to edit"})
    }
    const listToUpdate = {}
    if (task !== undefined) {
        listToUpdate.task = task
    }
    if (description !== undefined) {
        listToUpdate.description = description
    }
    if (completed !== undefined) {
        listToUpdate.completed = completed
    }
    if (Object.keys(listToUpdate).length === 0) {
        return res.status(400).json({message: "Nothing to edit"})
    }
    try {
        console.log(req.body)
        console.log(listToUpdate)
        const editTask = await Task.findOneAndUpdate({_id: taskId, user: userId}, {$set: listToUpdate}, {
            returnDocument: "after",
            runValidators: true
        })
        if (!editTask) {
            return res.status(404).json({message: "Task not found"})
        }
        res.status(200).json({message: "Task edited successfully", editTask})
    }
    catch (err) {
        console.error(`Error to edit task: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

