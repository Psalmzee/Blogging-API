const express = require('express');
const passport = require('passport');
require("dotenv").config();
const cors = require("cors");
const blogRouter = require('./routes/blog.route');
const authRouter = require('./routes/auth.route');

const app = express()

// register passport
require("./Authentication/passport") 

// middleware
app.use(express.json());

// routes
app.use('/blogs', passport.authenticate('jwt', { session: false  }), blogRouter)
app.use('/',  authRouter)

// home route
app.get('/', (req, res) => {
    return res.json({ message: 'WeBlog-API Home Route!', status: true })
})

// 404 route
app.use('*', (req, res) => {
    return res.status(404).json({ message: 'route not found' })
})

module.exports = app;
