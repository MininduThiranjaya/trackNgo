const mongoose = require('mongoose');
const DB_URL = process.env.DATABASE_URL;

async function database_connection() {

    mongoose.connect(DB_URL)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error(err));
}

module.exports = {
    database_connection
}