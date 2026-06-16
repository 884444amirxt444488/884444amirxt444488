const express = require("express")
const userRoute = require("./routes/userRoute")
const taskRoute = require("./routes/taskroute")
const connectDB = require("./acv/connectDB")
const dotenv = require("dotenv")
dotenv.config()
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

connectDB()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(userRoute)
app.use(taskRoute)


const PORT = 3000


app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})



