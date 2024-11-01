const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    busId: String,
    isActive: { type: Boolean, default: false },
    latitude: Number,
    longitude: Number,
    lastUpdated: { type: Date, default: Date.now },
});

const Bus = mongoose.model('Bus', BusSchema);

module.exports = Bus;