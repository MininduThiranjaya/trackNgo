const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busNameId: String,
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now },
});

const Bus = mongoose.model('buses', BusSchema);

module.exports = Bus;