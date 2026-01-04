const axios = require("axios");
const fs = require("fs").promises;

async function fetchData() {
    try {
        const response = await axios.get(process.env.FETCH_BODIES, {
            headers: {
                "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
                "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
            },
            params: {
                attribute: "bodies.type",
                year: "2020",
            },
        });
        options;
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
