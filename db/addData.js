const cron = require("node-cron");
const { carBodies } = require("../carBodies");
const { dbConn } = require("./conn");
const { Car } = require("../model");
const { fetchCarModel, fetchModelInterest } = require("./utils");

const addData = async () => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        console.log(`Adding Data ${date}`);

        // Commented to stop auto api calls
        // let data = [];
        // for (const body of carBodies) {
        // let bodyMakeModels = await fetchCarModel(body, year);
        //     for (const cmm of bodyMakeModels.slice(0, 2)) {
        //         const mm = cmm.make + " " + cmm.model;
        //         const interest = await fetchModelInterest(mm);
        //         data.push({
        //             make: cmm.make,
        //             model: cmm.model,
        //             bodyType: body.toLowerCase(),
        //             interestScore: interest,
        //         });
        //     }
        // }

        // console.log(data);
        // if (data.length > 0) {
        //     console.log("Old data deleted");
        //     await Car.deleteMany({});
        //     await Car.insertMany(data);
        //     console.log(`Data added ${date}`);
        // } else {
        console.log("No data added");
        // }
    } catch (err) {
        console.log("Error Occured", err);
    }
};

const main = async () => {
    await dbConn();
    await addData();
};

// main();
// cron.schedule("0 10 * * *", main);

cron.schedule("0 5 * * *", main); // Render
