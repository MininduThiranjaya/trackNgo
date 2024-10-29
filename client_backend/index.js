// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database_connection = require('./db_connection');
const all_routes = require('./all_routes');
const PORT = process.env.CLIENT_BACKEND_PORT;

const app = express();

app.use(cors(
    {
        origin:'*',
        methods: ['GET', 'POST'], // Allow specific HTTP methods
        credentials: true // If you want to include cookies or authorization headers
    }
));

app.use(express.json());
app.use('/api', all_routes);

database_connection.database_connection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
