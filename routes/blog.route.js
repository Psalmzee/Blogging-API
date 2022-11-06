const express = require('express')
const passport = require('passport');
const isCreator = require('../middleware/isCreator')
const pagination = require('../middleware/pagination')
const blogRouter = express.Router();
const blogController = require('../controllers/blog.controller')
const { filter_by_published, list, filter_and_sort, set_user_filter } = require('../middleware/apiHelpers')
// Register passport
require("../Authentication/passport-jwt")(passport) //signup and login authentication middleware

// Use passport middleware
app.use(passport.initialize())


blogRouter.get('/', filter_by_published, list, filter_and_sort,  pagination, blogController.get_blogs)
blogRouter.post('/create', passport.authenticate('jwt', {session: false }), blogController.create_blog);

blogRouter.get('/p', pagination, set_user_filter, filter_and_sort, passport.authenticate('jwt', {session: false }), blogController.get_blogs)

blogRouter.get('/:id', passport.authenticate('jwt', {session: false }), blogController.get_blog)
blogRouter.patch('/:id', isCreator, passport.authenticate('jwt', {session: false }), blogController.update_blog_by_state)
blogRouter.put('/:id', isCreator, passport.authenticate('jwt', {session: false }), blogController.update_blog)
blogRouter.delete('/:id', isCreator, passport.authenticate('jwt', {session: false }), blogController.delete_blog)


module.exports = blogRouter;
