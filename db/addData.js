// const cron = require("node-cron");
const { carBodies } = require("../carBodies");
const { Car } = require("../model");
const { fetchCarModel, fetchModelInterest, getImage } = require("./utils");

const addData = async () => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        console.log(`Adding Data ${date}`);

        let data = [];
        for (const body of carBodies) {
            let bodyMakeModels = await fetchCarModel(body, year);
            for (const cmm of bodyMakeModels.slice(0, 2)) {
                const mm = cmm.make + " " + cmm.model;
                const interest = await fetchModelInterest(mm);
                const imageURL = await getImage(mm);
                const price = Math.floor(Math.random() * 50000) + 20000;
                data.push({
                    make: cmm.make,
                    model: cmm.model,
                    bodyType: body.toLowerCase(),
                    interestScore: interest,
                    imageUrl: imageURL,
                    startingPrice: price,
                });
            }
        }

        console.log(data);
        if (data.length > 0) {
            console.log("Old data deleted");
            await Car.deleteMany({});
            await Car.insertMany(data);
            console.log(`Data added ${date}`);
        } else {
            console.log("No data added");
        }
    } catch (err) {
        console.log("Error Occured", err);
    }
};

// addData();

// cron.schedule("30 10 * * *", main);

// cron.schedule("0 5 * * *", main); // Render

module.exports = { addData };
