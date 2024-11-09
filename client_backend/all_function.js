const Bus = require('./models/bus');
const Route = require('./models/busRoute');

const axios = require('axios');

async function get_bus_location(req, res) {

    try {
        const buses = await Bus.find({});
        return res.status(200).json(buses);
    } catch (error) {
        res.status(500).send('Error fetching bus locations');
    }
}

async function get_location_code_search_by_name(req, res) {

    const { sourceLocation, destinationLocation } = req.body;
    const API_KEY = 'AIzaSyAiQ_WJER_3HDCs0B6tH01WPTCzB1COSLA';

    console.log(sourceLocation);
    console.log(destinationLocation);

    try {
        const sourceResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: sourceLocation,
                key: API_KEY,
            },
        });

        const destinationResponse = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: destinationLocation,
                key: API_KEY,
            },
        });

        if (sourceResponse.data.status === "OK" && destinationResponse.data.status === "OK") {

            const sourceLocation = sourceResponse.data.results[0].geometry.location;
            const destinationLocation = destinationResponse.data.results[0].geometry.location;
            
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




async function get_buses(req, res) {

    const { sourceLocation, destinationLocation } = req.body;

    console.log(sourceLocation)
    console.log(destinationLocation)

    try {
        // const busRouteWithBus = await Route.find({
        //     $and: [
        //         { $expr: { $eq: ["$source", `${sourceLocation}`] } },
        //         { $expr: { $eq: ["$destination", `${destinationLocation}`] } }
        //     ]
        // });

        const busRouteWithBus = await Route.aggregate(
            [
                {
                    "$match": {
                        "source": "polonnaruwa",
                        "destination": "kurunegala"
                    }
                },
                {
                    "$lookup": {
                        "from": "buses",
                        "localField": "busName",
                        "foreignField": "busNameId",
                        "as": "details"
                    }
                },
                {
                    "$unwind": {
                        "path": "$details"
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "_id": "$_id",
                            "source": "$source",
                            "stops": "$stops",
                            "destination": "$destination",
                        },
                        "busInfo": {                           // Aggregate bus info into an array
                            "$push": {
                                "busNameId": "$details.busNameId",
                                "isActive": "$details.isActive"
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": "$_id._id",
                        "source": "$_id.source",
                        "stops": "$_id.stops",
                        "destination": "$_id.destination",
                        "busInfo": 1                           // Include the aggregated bus info array
                    }
                }
            ]
            
        )
        console.log(busRouteWithBus)
        res.json({busRouteWithBus});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route', error });
    }  
}

async function get_route(req, res) {

    const { routeId } = req.body;

    console.log(routeId)

    try {
        const specificBusRoute = await Route.findById(routeId)

        console.log(specificBusRoute)

        res.json({specificBusRoute});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching route', error });
    }  
}


module.exports = {
    get_route,
    get_bus_location,
    get_location_code_search_by_name,
    get_buses
}