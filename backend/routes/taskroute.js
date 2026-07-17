const express = require("express")
const router = express.Router()
const taskController = require("../controllers/task")
const {authenciateAccessToken} = require("../acv/authenciate")


router.post("/addTask/:columnId", authenciateAccessToken, taskController.addTask)
router.delete("/deleteTask/:taskId", authenciateAccessToken, taskController.deleteTask)
router.delete("/deleteAllTasks/:columnId", authenciateAccessToken, taskController.deleteAllTasks)
router.patch("/editTask/:taskId", authenciateAccessToken, taskController.editTask)
router.get("/getTasks/:columnId", authenciateAccessToken, taskController.getTasks)
router.patch("/reorder", authenciateAccessToken, taskController.reorder)



module.exports = router





