const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user.model')
const Blog = require('../models/blog.model')
const utils = require('./test.utils')

let token

const login = async (username) => {
  const response = await api.post('/api/login').send({
    username,
    password: 'Altschooler123'
  })

  token = response.body
}

beforeAll(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const users = utils.initialUsers()
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i])
  }

  const blogs = utils.initialblogs()
  for (let i = 0; i < 100; i++) {
    await Blog.create(blogs[i])
  }
})

describe('Creating a Blog', () => {

  it('should work with valid token', async () => {
    const user = 'user1'
    await login(user)

    const blogsBefore = await utils.blogsInDb()

    const response = await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${token.token}`)
      .send(helper.blogObject(`Blog by ${user}`))
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data).toHaveProperty('title')
    expect(response.body.data).toHaveProperty('description')
    expect(response.body.data).toHaveProperty('tags')
    expect(response.body.data).toHaveProperty('author')
    expect(response.body.data).toHaveProperty('createdAt')
    expect(response.body.data).toHaveProperty('updatedAt')
    expect(response.body.data).toHaveProperty('read_count')
    expect(response.body.data).toHaveProperty('reading_time')
    expect(response.body.data).toHaveProperty('body')
    expect(response.body.data).toHaveProperty('state')
    expect(response.body.data.state).toBe('draft')

    const blogsAfter = await utils.blogsInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length - 1)
  })

  it('should return an error if no valid tokens are provided', async () => {
    const blogsBefore = await utils.blogsInDb()
    const response = await api
      .post('/api/blog')
      .send(utils.blogObject('Cannot view this Blog, you don\'t have a valid token!'))
      .expect(403)

    expect(response.body.status).toBe(false)

    const blogsAfter = await utils.blogsInDb()
    expect(blogsBefore.length).toBe(blogsAfter.length)
  })
})

describe('GET request to /api/blog', () => {
  it('when not logged in should be able to get a list of published blogs', async () => {
    const response = await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map(blog => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('when logged in should be able to get a list of published blogs', async () => {
    const user = 'user1'
    await login(user)

    const response = await api
      .get('/api/blog')
      .set('Authorization', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogStates = response.body.data.map(blog => blog.state)
    expect(blogStates).not.toContain('draft')
    expect(response.body.data[0]).not.toHaveProperty('body')
  })

  it('when requested by ID should be able to get a published blog', async () => {
    const blogAtStart = await utils.blogsInDb()

    const blogToView = blogAtStart[0]

    const resultBlog = await api
      .get(`/api/blog/${blogToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(BlogToView))

    expect(resultBlog.body.data.title).toEqual(processedBlogToView.title)
    expect(resultBlog.body.data.body).toEqual(processedBlogToView.body)
    expect(resultBlog.body.data.tags).toEqual(processedBlogToView.tags)
    expect(resultBlog.body.data._id).toEqual(processedBlogToView._id)
  })

  it('when requested by ID should return the author information', async () => {
    const blogsAtStart = await utils.blogsInDb()
    const users = await utils.usersInDb()
    const user1 = users[0]

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blog/${blogToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAuthor = resultBlog.body.data.author
    expect(blogAuthor.username).toBe(user1.username)
    expect(blogAuthor.id).toBe(user1.id)
  })

  it('when requested by ID should increase the read_count by 1', async () => {
    const blogAtStart = await utils.blogInDb()

    const blogToView = blogAtStart[0]

    await api
      .get(`/api/blog/${blogToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtMid = await utils.blogsInDb()
    const blogViewedAtMid = blogsAtMid[0]

    expect(blogViewedAtMid.read_count).toBe(blogToView.read_count + 1)

    await api
      .get(`/api/blog/${blogToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await utils.blogsInDb()
    const blogViewed = blogsAtEnd[0]

    expect(blogViewed.read_count).toBe(blogToView.read_count + 2)
  })

  it('returns a maximum of 20 blogs per page', async () => {
    const response = await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data.length).toBe(20)
  })

  it('returns n blogs per page and a maximum of 20 blogs per page', async () => {
    let size = 9
    const response = await api
      .get(`/api/blog?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.data.length).toBe(size)

    size = 90
    const response2 = await api
      .get(`/api/blog?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response2.body.data.length).toBe(20)
  })
})

afterAll(async () => {
  mongoose.connection.close()
})
