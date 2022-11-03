const express = require('express')
const blogRouter = express.Router();
const blogController = require('../controllers/blog.controller')
const passport = require('passport');




//GET a listing of all Published Blogs
blogRouter.get('/', blogController.publishedBlogs);

//GET a single Published Blog
blogRouter.get('/:id', blogController.publishedBlog);

//POST a new Blog
blogRouter.post('/create', passport.authenticate('jwt', {session: false }), blogController.createBlog);



module.exports = blogRouter;
