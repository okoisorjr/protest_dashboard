const mongoose = require("mongoose");

const StatesInfoSchema = new mongoose.Schema({
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'data' },
    governor: { type: String, required: true },
    population: { type: Number, required: true },
    protestIncidents: { type: Number }
}, { timestamps: true });

const StateInfoModel = mongoose.model("state", StatesInfoSchema);

module.exports = StateInfoModel;