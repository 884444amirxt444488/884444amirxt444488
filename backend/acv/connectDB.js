const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/User")
        console.log(`MONGODB connected successfully`)
    }
    catch (err) {
        console.error(`Error to connect mongodb: `, err)
        process.exit(1)
    }
}


module.exports = connectDB





