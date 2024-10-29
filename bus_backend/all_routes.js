const express = require('express');
const route = express.Router();
const all_function = require('./all_function');

// API to update bus location
route.post('/update-location', all_function.update_location);

module.exports = route;