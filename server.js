const express = require('express');
const app = require('./app')
const Database = require('./database/db');
require('dotenv').config();

const PORT = process.env.PORT || 9002

// connect to database
Database.connectToMongoDB();

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})