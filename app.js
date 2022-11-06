const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');


// const Database = require('./database/db');

//Custom Router
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errHandler')

const app = express();

require("dotenv").config();

// Use passport middleware
app.use(passport.initialize())

// Register passport
require("./Authentication/passport-jwt")(passport) //signup and login authentication middleware



// const PORT = process.env.PORT || 9002

// connect to database
// Database.connectToMongoDB();

// middleware to parse information from request
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// app.post('/api/signup', (req, res)=>{
// console.log(req.body)
// res.end("I av terminated")
// })
// app.use('/api/blogs', blogRouter)
// Authenticated Routes
app.use('/api',  authRouter);
app.use('/api/blogs', blogRouter)


app.get('/', function(req, res, next) {
    return res.send("Test Route, Server is working!")
});


// home route
app.get('/api', (req, res) => {
    return res.json({ message: 'WeBlog-API Home Route!', status: true })
})

// Server Errors
app.use((error, req, res) => {
    return res.status(500).json({ message: 'Server Failed to Process Your Request!'})
})

//middleware for unrecognized endpoints
app.use(unknownEndpoint)

// use error handler middleware
app.use(errorHandler)

// 404 Errors
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'Route not Found!' })
});


module.exports = app
