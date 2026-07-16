const express = require("express")
const router = express.Router()
const columnController = require("../controllers/column")
const {authenciateAccessToken} = require("../acv/authenciate")


router.post("/addColumn", authenciateAccessToken, columnController.addColumn)
router.delete("/deleteColumn/:columnId", authenciateAccessToken, columnController.deleteColumn)
router.patch("/editColumn/:columnId", authenciateAccessToken, columnController.editColumn)
router.get("/getColumn", authenciateAccessToken, columnController.getColumn)
router.delete("/deleteAll", authenciateAccessToken, columnController.deleteAllColumns)





module.exports = router






