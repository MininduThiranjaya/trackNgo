const express = require('express');
const route = express.Router();
const { getRoute, getBusLocation, getLocationCodeSearchByName, getBus} = require('../controller/userController');

// API to fetch all bus locations
route.post('/search_for_buses', getBus);

// API to fetch all bus locations
route.post('/get-specific-bus-route', getRoute);

// API to fetch all bus locations
route.get('/get-bus-locations/:busId', getBusLocation);

// Get location code by serching 
route.post('/get-location-code-search-by-name', getLocationCodeSearchByName);

// Get route paths 
//route.post('/get-route', all_function.get_route);

module.exports = route;