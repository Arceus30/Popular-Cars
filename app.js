const express = require("express");
const cors = require("cors");
const { Car } = require("./model");
const { dbConn } = require("./conn");

dbConn();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/popular-cars/api", async (req, res, next) => {
    try {
        const { q = "Hatchback" } = req.query;
        const carsFound = await Car.find({ bodyType: q }).sort({
            interestScore: -1,
        });
        const numCars = carsFound.length;
        if (!carsFound || !carsFound.length) {
            return res
                .status(404)
                .json({ success: false, message: "No cars Found" });
        }

        return res.status(200).json({
            success: true,
            message: `${numCars} Cars Found`,
            cars: carsFound,
        });
    } catch (e) {
        next(e);
    }
});

app.use((err, req, res, next) => {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}`);
});
