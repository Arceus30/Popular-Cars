require("dotenv").config();
const axios = require("axios");
const fs = require("fs").promises;
const { getJson } = require("serpapi");

const fetchCarModelPage = async (year, body, page) => {
    try {
        const response = await axios.get(process.env.FETCH_MODELS, {
            params: {
                sort: "id",
                verbose: "yes",
                direction: "asc",
                year,
                type: body,
                page,
            },
            headers: {
                "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
                "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const fetchCarModel = async (body, year) => {
    try {
        let allItems = [];
        let page = 1;
        let hasMorePages = true;
        const seen = new Set();

        while (hasMorePages) {
            const data = await fetchCarModelPage(year, body, page);
            if (data.collection && data.data) {
                for (d of data.data) {
                    const make = d?.make_model_trim?.make_model?.make?.name;
                    const model = d?.make_model_trim?.make_model?.name;
                    const key = `${make}::${model}`;
                    if (!seen.has(key)) {
                        seen.add(key);
                        allItems.push({ make, model });
                    }
                }
            }

            if (data.collection && data.collection.pages > page) {
                page++;
            } else {
                hasMorePages = false;
            }
        }

        console.log(
            `${allItems.length} models found for body type ${body} in year ${year}`
        );
        return allItems;
    } catch (error) {
        throw error;
    }
};

const calculateAverage = (timeline_data) => {
    const values = timeline_data?.map(
        (item) => item.values[0]?.extracted_value
    );

    if (!values || values.length === 0) return 0;

    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
};

const fetchModelInterest = async (mm) => {
    try {
        const result = await new Promise((resolve, reject) => {
            getJson(
                {
                    engine: "google_trends",
                    q: mm,
                    data_type: "TIMESERIES",
                    api_key: process.env.SERP_API_KEY,
                    geo: "US",
                    date: "today 3-m",
                },
                (json) => {
                    try {
                        const timeline_data =
                            json["interest_over_time"]?.timeline_data;
                        const average = calculateAverage(timeline_data);
                        resolve(average);
                    } catch (err) {
                        reject(err);
                    }
                }
            );
        });
        return result;
    } catch (err) {
        console.error(`Error in fetching the interest ${error}`);
        throw err;
    }
};

const getImage = async (makeModel) => {
    try {
        const accessKey = process.env.UNSPLASH_ACCESS_KEY;
        const res = await axios.get("https://api.unsplash.com/photos/random", {
            params: {
                query: makeModel,
                count: 1,
            },
            headers: {
                Authorization: `Client-ID ${accessKey}`,
            },
        });
        const photo = Array.isArray(res.data) ? res.data[0] : res.data;
        return photo.urls.regular;
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = {
    fetchCarModel,
    fetchModelInterest,
    getImage,
};
