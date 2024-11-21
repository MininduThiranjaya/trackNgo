
// const Bus = require('../models/busModel');
// const Route = require('../models/busRoute');
const BusRoute = require('../models/busRouteModel');
const BusLocation = require('../models/busLocationModel');

const axios = require('axios');

async function getBusLocation(req, res) {
    try {
        const busId = req.params.busId;
        console.log(busId)
        const buses = await BusLocation.findOne({'busNumber':busId});
        console.log(buses);
        return res.status(200).json(buses);
    } catch (error) {
        res.status(500).send('Error fetching bus locations');
    }
}

async function getLocationCodeSearchByName(req, res) {

    const { startLocation, endLocation } = req.body;
    const API_KEY = 'AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA';

    console.log(startLocation);
    console.log(endLocation);

    try {
        const startLocationResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: startLocation,
                key: API_KEY,
            },
        });

        const endLocationResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: endLocation,
                key: API_KEY,
            },
        });

        if (startLocationResponse.data.status === "OK" && endLocationResponse.data.status === "OK") {

            const sourceLocation = startLocationResponse.data.results[0].geometry.location;
            const destinationLocation = endLocationResponse.data.results[0].geometry.location;
            
            // Get the route path between start and end locations
            const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
                params: {
                    origin: `${sourceLocation.lat},${sourceLocation.lng}`,
                    destination: `${destinationLocation.lat},${destinationLocation.lng}`,
                    key: API_KEY // Replace with your Google API key
                }
            });

            if (response.data.status === "OK") {

                const route = response.data.routes[0].overview_polyline.points

                res.json({
                    sourceLocation,
                    destinationLocation,
                    route
                });
            } else {
                res.status(404).json({ error: "Route not found." });
            }    
        } else {
            res.status(404).json({ error: "Location not found." });
        }        
    } catch (error) {
        console.error("Error fetching directions:", error);
        res.status(500).send("Error fetching directions");
    }
}




// async function getBus(req, res) {

//     const { startLocation, endLocation } = req.body;

//     console.log(startLocation)
//     console.log(endLocation)

//     try {

//         const busRouteWithBus = await Route.aggregate(
//             [
//                 {
//                     "$match": {
//                         "source": startLocation,
//                         "destination": endLocation
//                     }
//                 },
//                 {
//                     "$unwind": "$busName"                  // Unwind busName array to access each bus's details
//                 },
//                 {
//                     "$lookup": {
//                         "from": "buses",
//                         "localField": "busName.name",       // Match busName name to busNameId in buses collection
//                         "foreignField": "busNameId",
//                         "as": "details"
//                     }
//                 },
//                 {
//                     "$unwind": "$details"                  // Unwind details array to pair with each bus
//                 },
//                 {
//                     "$group": {
//                         "_id": {
//                             "_id": "$_id",
//                             "source": "$source",
//                             "stops": "$stops",
//                             "destination": "$destination"
//                         },
//                         "busInfo": {
//                             "$push": {                     // Aggregate each bus's info including name, action, and isActive
//                                 "busNameId": "$details.busNameId",
//                                 "isActive": "$details.isActive",
//                                 "action": "$busName.action"
//                             }
//                         }
//                     }
//                 },
//                 {
//                     "$project": {
//                         "_id": "$_id._id",
//                         "source": "$_id.source",
//                         "stops": "$_id.stops",
//                         "destination": "$_id.destination",
//                         "busInfo": 1                       // Include the aggregated busInfo array with name, action, and isActive
//                     }
//                 }
//             ]            
//         )

//         console.log(busRouteWithBus)
//         res.json({busRouteWithBus});
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching route', error });
//     }  
// }

async function getBus(req, res) {

    const { startLocation, endLocation } = req.body;

    console.log(startLocation)
    console.log(endLocation)

    try {

        const busRouteWithBus = await BusRoute.find(
            {
                "startLocation":startLocation,
                "endLocation":endLocation
            }
        )

        console.log(busRouteWithBus)
        res.json({busRouteWithBus});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route', error });
    }  
}

async function getRoute(req, res) {

    const { busRouteId } = req.body;

    console.log(busRouteId)

    try {
        const specificBusRoute = await BusRoute.findById(busRouteId)

        console.log(specificBusRoute)

        res.json({specificBusRoute});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route', error });
    }  
}


module.exports = {
    getRoute,
    getBusLocation,
    getLocationCodeSearchByName,
    getBus
}