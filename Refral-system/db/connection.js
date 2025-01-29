const mongoose = require ("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connect to mongoDB");
    } catch (error) {
        console.error("DataBase connection faild!");
    };
}

module.exports = connectDB;