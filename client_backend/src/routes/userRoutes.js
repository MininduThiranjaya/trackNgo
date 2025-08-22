const express = require('express');
const route = express.Router();
const { getRoute, getBusLocation, getLocationCodeSearchByName, getBus, getDistance} = require('../controller/userController');

// API to fetch all bus locations
route.post('/search-for-buses', getBus);

// API to fetch all bus locations
route.post('/get-specific-bus-route', getRoute);

// API to fetch all bus locations
route.get('/get-bus-locations/:busId', getBusLocation);

// Get location code by serching 
route.post('/get-location-code-search-by-name', getLocationCodeSearchByName);

route.post('/get-location-distance', getDistance);

// Get route paths 
//route.post('/get-route', all_function.get_route);

module.exports = route;