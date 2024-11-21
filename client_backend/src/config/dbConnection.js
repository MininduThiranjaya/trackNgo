const mongoose = require('mongoose');
const DB_URL = process.env.DATABASE_URL;

async function databaseConnection() {

    mongoose.connect(DB_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error(err));
}

module.exports = {
    databaseConnection
}