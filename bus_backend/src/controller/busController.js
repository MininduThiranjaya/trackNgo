const Bus = require('../models/bus');

const axios = require('axios');

async function updateBusLocatioin(req, res) {

    const { busNumber, latitude, longitude, accuracy } = req.body;
    console.log(`lat : ${busNumber}`)
    console.log(`lat : ${latitude}`)
    console.log(`lon : ${longitude}`)
    console.log(`acc : ${accuracy}`)
    try {
        await Bus.findOneAndUpdate(
            { 'busNumber':busNumber },
            { $set: { latitude, longitude, timestamps: new Date() }},
            { upsert: true }
        );
        res.status(200).send('Location updated');
    } catch (error) {
        res.status(500).send('Error updating location');
    }
}

module.exports = {
    updateBusLocatioin
}