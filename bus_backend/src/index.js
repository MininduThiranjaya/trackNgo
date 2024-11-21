// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { databaseConnection } = require('./config/dbConnection');
const busRoute = require('./routes/busRoutes');

const app = express();

app.use(cors(
    {
        origin:'*',
        methods: ['GET', 'POST', 'PUT'], // Allow specific HTTP methods
        credentials: true // If you want to include cookies or authorization headers
    }
));

databaseConnection();

app.use(express.json());

app.use('/api-bus', busRoute);

const PORT = process.env.BUS_BACKEND_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port number ${PORT}`);
});
