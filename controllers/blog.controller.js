const Blog = require('../models/blog.model')

const create_blog = async (req, res, next) => {
  try {
    // get details from the request
    const { title, description, tags, body } = req.body
    // create blog object
    const newBlog = new Blog({
      title,
      description: description || title,
      tags,
      author: req.user._id,
      body,
      owner: req.user.username,
    })
    // save to database
    const createdBlog = await newBlog.save()

    // save blog ID to user document
    req.user.blogs = req.user.blogs.concat(createdBlog._id)
    await req.user.save()

    // return response
    return res.status(201).json({
      status: 'success',
      data: createdBlog,
    })
  } catch (err) {
    err.source = 'creating a blog'
    next(err)
  }
}

const get_blogs = async (req, res, next) => {
  try {
    const blogs = await Blog
      .find(req.findFilter)
      .sort(req.sort)
      .select(req.fields)
      .populate('author', { username: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage)

    const pageInfo = req.pageInfo

    return res.json({
      status: 'success',
      pageInfo,
      data: blogs,
    })
  } catch (err) {
    err.source = 'get published blogs controller'
    next(err)
  }
}

const get_blog = async (req, res, next) => {
  try {
    const { id } = req.params

    const blog = await Blog.findById(id).populate('author', { username: 1 })

    if (!blog) {
      return res.status(404).json({
        status: 'Operation Failed!',
        message: 'Blog Not Found!'
      })
    }

    if (blog.state !== 'published') {
      const response = (res) => {
        return res.status(403).json({
          status: 'Operation Failed!',
          error: 'Requested Blog is not yet Published!',
        })
      }
      if (!req.user) {
        return response(res)
      } else if (blog.author._id.toString() !== req.user.id.toString()) {
        return response(res)
      }
    }

    // Updating blog read-count //read_count not accessible
    blog.read_count += 1
    await blog.save()

    return res.json({
      status: 'success',
      data: blog,
    })
  } catch (err) {
    err.source = 'get published blog controller'
    next(err)
  }
}

const update_blog_by_state = async (req, res, next) => {
  try {
    let { state } = req.body

    if (!(state && (state.toLowerCase() === 'published' || state.toLowerCase() === 'draft'))) {
      throw new Error('Please Provide a Valid State!, "draft" or "published"?')
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, { state: state.toLowerCase() }, { new: true, runValidators: true, context: 'query' })

    if (!blog) {
      return res.status(404).json({
        status: 'Operation Failed!',
        message: 'Blog not Found!'
      })
    }

    return res.json({
      status: 'success',
      data: blog
    })
  } catch (err) {
    err.source = 'updating blog by state'
    next(err)
  }
}

const update_blog = async (req, res, next) => {
  try {
    let blogUpdate = { ...req.body }

    if (blogUpdate.state) delete blogUpdate.state

    const blog = await Blog.findByIdAndUpdate(req.params.id, blogUpdate, { new: true, runValidators: true, context: 'query' })

    if (!blog) {
      return res.status(404).json({
        status: 'Operation Failed!',
        message: 'Blog not Found!'
      })
    }

    return res.json({
      status: 'success',
      data: blog
    })
  } catch (err) {
    err.source = 'updating blog'
    next(err)
  }
}

const delete_blog = async (req, res, next) => {
  const user = req.user
  try {
    const deletedBlog = await Blog.findByIdAndRemove(req.params.id)

    if (!deletedBlog) {
      return res.status(404).json({
        status: 'Operation Failed!',
        error: 'Blog not Found!'
      })
    }


    const deletedBlogId = deletedBlog._id
    const index = user.blogs.indexOf(deletedBlogId)
    user.blogs.splice(index, 1)

    await user.save()

    res.json({
      status: 'success',
      data: deletedBlog
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  create_blog,
  get_blogs,
  get_blog,
  update_blog,
  update_blog_by_state,
  delete_blog
}
