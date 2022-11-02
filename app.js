const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require("cors");


//Custom Router
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');


require("dotenv").config();

// Register passport
require("./Authentication/passport-jwt")  //signup and login authentication middleware

const app = express();



// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



app.use('/',  authRouter);

// Authenticated Routes
app.use('/api/blogs', passport.authenticate('jwt', { session: false  }), blogRouter)


app.get('/testing', function(req, res, next) {
    return res.send("Test Route, Server is working!")
});


// home route
app.get('/', (req, res) => {
    return res.json({ message: 'WeBlog-API Home Route!', status: true })
})

// 404 Errors
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Route not Found!' })
});

// Server Errors
app.use((error, req, res) => {
    return res.status(500).json({ message: 'Server Failed to Process Your Request!'})
})

module.exports = app;
