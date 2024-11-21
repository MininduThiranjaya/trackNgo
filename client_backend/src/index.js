// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { databaseConnection } = require('./config/dbConnection');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());


app.use(cors(
    {
        origin:'*',
        methods: ['GET', 'POST'], // Allow specific HTTP methods
        credentials: true // If you want to include cookies or authorization headers
    }
));

databaseConnection();

app.use('/api-user', userRoutes);

const PORT = process.env.CLIENT_BACKEND_PORT;

app.listen(PORT, () => {
    console.log(`Server running on port number : ${PORT}`);
});
