const express = require("express")
const router = express.Router()
const taskController = require("../controllers/task")
const {authenciateAccessToken, authenciateRefreshToken} = require("../acv/authenciate")


router.post("/addTask", authenciateAccessToken, taskController.addTask)
router.get("/getTasks", authenciateAccessToken, taskController.getTasks)
router.delete("/deleteTask/:id", authenciateAccessToken, taskController.deleteTask)
router.patch("/editTask/:id", authenciateAccessToken, taskController.editTask)



module.exports = router


