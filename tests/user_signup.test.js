const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user.model')
const utils = require('./test.utils')

beforeEach(async () => {
  await User.deleteMany({})
})

describe('post request to api/signup', () => {
  test('with correct details successfully creates a user', async () => {
    const newUser = {
      firstName: 'User',
      lastName: 'One',
      username: 'user1',
      email: 'user1@mail.com',
      password: 'password',
    }

    const usersInDbBefore = await utils.usersInDb()
    const response = await api
      .post('/api/signup')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDbAfter = await utils.usersInDb()
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length - 1)

    expect(Object.keys(response.body.data)).not.toContain('password')
  })

  test('with incorrect details returns an error', async () => {
    const newUser = {
      firstName: 'User',
      lastName: 'One',
      username: 'user1',
      email: 'user1@mail.com',
    }

    const usersInDbBefore = await utils.usersInDb()
    await api
      .post('/api/signup')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersInDbAfter = await utils.usersInDb()
    expect(usersInDbBefore.length).toBe(usersInDbAfter.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
