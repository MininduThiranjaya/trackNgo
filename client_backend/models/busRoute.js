const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    source: String,
    destination: String,
    stops:[String],
    busName:[String],
    lastUpdated: { type: Date, default: Date.now },
});

const Route = mongoose.model('route', routeSchema);

module.exports = Route;