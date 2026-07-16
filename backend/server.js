const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("./acv/connectDB")
const userRoute = require("./routes/userRoute")
const columnRoute = require("./routes/columnRoute")
const taskRoute = require("./routes/taskroute")

connectDB()

const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(userRoute)
app.use(columnRoute)
app.use(taskRoute)


const PORT = 3000


app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})




