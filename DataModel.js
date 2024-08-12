const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    id: { type: String, required: true },
    value: { type: Number, required: true },
    name: { type: String, required: true }
});

const DataModel = mongoose.model("data", DataSchema);

module.exports = DataModel;