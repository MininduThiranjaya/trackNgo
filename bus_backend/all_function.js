const Bus = require('./models/bus');
const Route = require('./models/busRoute');

const axios = require('axios');

async function update_location(req, res) {

    // busNameId = req.params.busId;

    // console.log(busNameId);

    const { busId, latitude, longitude, accuracy } = req.body;
    console.log(`lat : ${latitude}`)
    console.log(`lon : ${longitude}`)
    console.log(`acc : ${accuracy}`)
    try {
        await Bus.findOneAndUpdate(
            { 'busNameId':busId },
            { $set: { latitude, longitude, lastUpdated: new Date() }},
            { upsert: true }
        );
        res.status(200).send('Location updated');
    } catch (error) {
        res.status(500).send('Error updating location');
    }
}

module.exports = {
    update_location
}