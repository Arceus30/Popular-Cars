const mongoose = require("mongoose");

const dbConn = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_CONNECT_STRING ||
                "mongodb://localhost:27017/CarTrends"
        );
        console.log("Server Database Connected successfully");
    } catch (err) {
        console.error("Server database connection error:", err.message);
    }
};

module.exports = { dbConn };
