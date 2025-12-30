const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const carSchema = new Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    bodyType: { type: String, required: true },
    interestScore: { type: Number, required: true },
});

module.exports = model("Car", carSchema);
