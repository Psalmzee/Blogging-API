const moogoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// connect to mongodb
function connectToMongoDB() {
    moogoose.connect(MONGODB_URI);

    moogoose.connection.on('connected', () => {
        console.log('Connected to MongoDB Successfully!');
    });

    moogoose.connection.on('error', (err) => {
        console.log('Error Connecting to MongoDB!', err);
    })
}

module.exports = { connectToMongoDB };