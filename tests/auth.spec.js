const request = require('supertest')
const { connect } = require('./database')
const userModel = require('../models/user.model')
const app = require('../index');

describe('Auth: Signup', () => {
    let conn;

    beforeAll(async () => {
        conn = await connect()
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should signup a user', async () => {
        const response = await request(app).post('/signup')
        .set('content-type', 'application/json')
        .send({ 
            username: 'samAltschooler', 
            password: 'Password123', 
            firstName: 'Samson',
            lastName: 'Okeji',
            email: 'samsonaltschool@mail.com'
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body).toHaveProperty('user')
        expect(response.body.user).toHaveProperty('username', 'samAltschooler')
        expect(response.body.user).toHaveProperty('firstname', 'Samson')
        expect(response.body.user).toHaveProperty('lastname', 'Okeji')
        expect(response.body.user).toHaveProperty('email', 'samsonaltschool@mail.com')        
    })


    it('should login a user', async () => {
        // create user in out db
        const user = await userModel.create({ username: 'samsonAltschooler', password: 'password1234'});

        // login user
        const response = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'samsonAltschooler', 
            password: 'password1234'
        });
    

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('token')      
    })
})