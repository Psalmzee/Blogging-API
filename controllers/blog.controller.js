const Blog = require('../models/blog.model')
const { estimatedReadingTime } = require('../helpers/readingTime.helper')

const createBlog = async (req, res, next) => {
  try {

    // Get details from the request
    const { title, description, tags, body } = req.body

    // create new blog object
    const newBlog = new Blog({

      title,
      description: description || title,
      tags,
      author: req.user._id,
      body,
      reading_time: estimatedReadingTime(body)
    })


    // save to database
    const createdBlog = await newBlog.save()
    // return response
    return res.status(201).json({
      status: true,
      data: createdBlog,
    })
  } catch (e) {
    next(e)
  }
}

const publishedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find({ state: 'published' })
      .select({ title: 1 })
      .populate('author', { username: 1 })

    return res.json({
      status: true,
      data: blogs
    })
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const publishedBlog = async (req, res, next) => {
  try {
    const { id } = req.params
    const blog = await Blog.findById(id)
      .populate('author', { username: 1 })

    if (blog.state !== 'published') {
      return res.status(403).json({
        status: false,
        error: 'Requested Blog is not Published!'
      })
    }

    // update blog read count
    blog.read_count += 1
    await blog.save()

    return res.json({
      status: true,
      data: blog
    })
  } catch (err) {
    err.source = 'get published blog controller'
    next(err)
  }
}

module.exports = {
  createBlog,
  publishedBlogs,
  publishedBlog,
}
