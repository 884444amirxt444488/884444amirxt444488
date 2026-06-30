const connectDB = require("./acv/connectDB")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const cookieParser = require("cookie-parser")
const taskRoute = require("./routes/taskroute")
const userRoute = require("./routes/userRoute")
const app = express()

connectDB()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:27017",
    credentials: true
}))
app.use(cookieParser())
app.use(taskRoute)
app.use(userRoute)


const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})




