const mongoose = require("mongoose")



const ff = async() => {
    try {
        await mongoose.connect("mongodb://localhost:3000/User")
        console.log("Connected")
        await mongoose.connection.dropDatabase()
        console.log("Droped")
    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}

ff()

