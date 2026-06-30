const express = require("express")
const router = express.Router()
const {authenciateAccessToken, authenciateRefreshToken} = require("../acv/authenciate")
const taskController = require("../controllers/task")

router.post("/addTask",authenciateAccessToken, taskController.addTask)
router.get("/getTasks",authenciateAccessToken, taskController.getTasks)
router.delete("/deleteAllTasks",authenciateAccessToken, taskController.deleteAllTasks)
router.delete("/deleteTask/:id",authenciateAccessToken, taskController.deleteTask)
router.patch("/editTask/:id",authenciateAccessToken, taskController.editTask)


module.exports = router


