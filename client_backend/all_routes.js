const express = require('express');
const route = express.Router();
const all_function = require('./all_function');

// API to fetch all bus locations
route.post('/search_for_buses', all_function.get_buses);

// API to fetch all bus locations
route.post('/get-specific-bus-route', all_function.get_route);

// API to fetch all bus locations
route.get('/get-bus-locations', all_function.get_bus_location);

// Get location code by serching 
route.post('/get-location-code-search-by-name', all_function.get_location_code_search_by_name);

// Get route paths 
//route.post('/get-route', all_function.get_route);

module.exports = route;