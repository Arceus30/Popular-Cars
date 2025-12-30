const axios = require("axios");
const fs = require("fs").promises;

const options = {
    method: "GET",
    url: process.env.FETCH_BODIES,
    params: {
        attribute: "bodies.type",
        year: "2020",
    },
    headers: {
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
        "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
    },
};

async function fetchData() {
    try {
        const response = await axios.request(options);
        await fs.writeFile(
            `./car-bodies.json`,
            JSON.stringify(response.data, null, 2),
            "utf-8"
        );
    } catch (error) {
        console.error(error);
    }
}

fetchData();
