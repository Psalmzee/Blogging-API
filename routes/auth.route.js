const express = require('express')
const passport = require('passport');
const jwt = require('jsonwebtoken');


const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/signup', passport.authenticate('signup', { session: false }), authController.signup)

authRouter.post('/login', async (req, res, next) => passport.authenticate('login', (err, user, info) => {
    authController.login(req, res, { err, user, info})
})(req, res, next))


module.exports = authRouter;
