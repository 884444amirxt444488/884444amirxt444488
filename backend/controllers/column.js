const User = require("../models/User")
const Column = require("../models/Column")
const Task = require("../models/Task")




exports.addColumn = async(req, res) => {
    const {title} = req.body
    const userId = req.user._id
    if (!title) {
        return res.status(400).json({message: "Title is required"})
    }
    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(401).json({message: "User not found"})
        }
        const oldOrder = await Column.findOne({user: userId}).sort({order: -1})
        const newOrder = oldOrder ? oldOrder.order + 1 : 1
        const newUser = await Column.create({user: userId, title, order: newOrder})
        res.status(201).json({message: "Column created successfully", title: newUser.title, order: newUser.order})
    }
    catch (err) {
        console.error(`Error to add column: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.getColumn = async(req, res) => {
    const userId = req.user._id
    try {
        const allColumns = await Column.find({user: userId}).sort({order: 1})
        res.json(allColumns)
    }
    catch (err) {
        console.error(`Error to get column: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteColumn = async(req, res) => {
    const userId = req.user._id
    const {columnId} = req.params
    try {
        const deletedColumn = await Column.findOneAndDelete({user: userId, _id: columnId})
        if (!deletedColumn) {
            return res.status(400).json({message: "column not found"})
        }
        const newOrder = deletedColumn.order
        await Column.updateMany({user: userId, order: {$gt: newOrder}}, {$inc: {order: -1}})
        await Task.deleteMany({columnId})
        res.status(200).json({message: "Column deleted successfully"})
    }
    catch (err) {
        console.error(`Error to delete column: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.editColumn = async(req, res) => {
    const userId = req.user._id
    const {columnId} = req.params
    const {title} = req.body
    if (!title) {
        return res.status(400).json({message: "Title is required"})
    }
    try {
        const updateColumn = await Column.findOneAndUpdate({user: userId, _id: columnId}, {$set: {title}}, {
            returnDocument: "after",
            runValidators: true 
        }) 
        if (!updateColumn) {
            return res.status(404).json({message: "Column not found"})
        }
        res.status(200).json({message: "Updated successfully", updateColumn})
    }
    catch (err) {
        console.error(`Error to edit column: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}

exports.deleteAllColumns = async(req, res) => {
    const userId = req.user._id
    try {
        const allColumns = await Column.find({user: userId})
        const allColumnsToDelete = allColumns.map(item => item._id)
        await Task.deleteMany({columnId: {$in: allColumnsToDelete}})
        await Column.deleteMany({user: userId})
        res.status(200).json({message: "All columns and Tasks deleted"})
    }
    catch(err) {
        console.error(`Error to delete columns: `, err)
        res.status(500).json({message: "Error from server. please try later"})
    }
}



