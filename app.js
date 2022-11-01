const express = require('express');
const app = require('./index')
const Database = require('./database/db');

const PORT = process.env.PORT || 9002

// connect to database
Database.connect();

app.listen(PORT, () => {
    console.log('Listening on port, ', PORT)
})