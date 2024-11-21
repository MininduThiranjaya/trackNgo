const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema(
    {
        busNumber: {
            type: String,
            required: true
        },
        startLocation: {
            type: String,
            required: true
        },
        endLocation: {
            type: String,
            required: true
        },
        routeNumber: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['Normal', 'Semi-Luxury', 'Luxury'], default: 'Normal'
        },
        status: {
            type: Boolean,
            default: false
        },
        latitude: {
            type: Number,
        },
        longitude: {
            type: Number,
        }
    },
    {
        timestamps: true,
    },
);

const Bus = mongoose.model('buses', BusSchema);

module.exports = Bus;