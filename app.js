const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require("cors");

const Database = require('./database/db');


//Custom Router
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');

const app = express();

require("dotenv").config();

// Use passport middleware
app.use(passport.initialize())

// Register passport
require("./Authentication/passport-jwt")(passport) //signup and login authentication middleware



const PORT = process.env.PORT || 9002

// connect to database
Database.connectToMongoDB();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use('/api',  authRouter);

// app.post('/api/signup', (req, res)=>{
// console.log(req.body)
// res.end("I av terminated")
// })
// app.use('/api/blogs', blogRouter)
// Authenticated Routes
app.use('/api/blogs', blogRouter)


app.get('/', function(req, res, next) {
    return res.send("Test Route, Server is working!")
});


// home route
app.get('/api', (req, res) => {
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


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`)
})
