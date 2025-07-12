const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected succesfully")
    } catch(error){
        console.log("Error in connecting mongodb: ", error);
    }
}

module.exports = connectDB;