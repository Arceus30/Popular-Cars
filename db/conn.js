const mongoose = require("mongoose");

const dbConn = async () => {
    mongoose
        .connect(
            process.env.MONGO_CONNECT_STRING ||
                "mongodb://localhost:27017/CarTrends"
        )
        .then(() => {
            console.log(`Server Database Connected`);
        })
        .catch((err) => {
            console.log(`Server database connection error: ${err}`);
        });
};

module.exports = { dbConn };
