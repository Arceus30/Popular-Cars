const express = require("express");
const cors = require("cors");
const { Car } = require("./model");
const { dbConn } = require("./db/conn");
const { addData } = require("./db/addData");

dbConn();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const getFormattedDate = () =>
    new Date().toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour12: false,
    });

app.get("/popular-cars/api", async (req, res, next) => {
    try {
        const q = req.query.q?.toString().trim() || "hatchback";
        const carsFound = await Car.find({ bodyType: q.toLowerCase() }).sort({
            interestScore: -1,
        });
        const numCars = carsFound.length;
        if (!carsFound || !carsFound.length) {
            return res.status(404).json({
                date: getFormattedDate(),
                success: false,
                message: "No cars Found",
            });
        }

        return res.status(200).json({
            success: true,
            date: getFormattedDate(),
            message: `${numCars} Cars Found`,
            cars: carsFound,
        });
    } catch (err) {
        next(err);
    }
});

app.get("/cron-job", async (req, res, next) => {
    try {
        console.log("Cron-Job Started");
        // await addData();
        return res.status(200).json({ status: "success" });
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({
        date: new Date.now().toLocaleString(),
        message: "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
