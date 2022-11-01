const request = require('supertest')
const { connect } = require('./database')
const app = require('../index');
const moment = require('moment');
const blogModel = require('../models/blogModel');
const userModel = require('../models/userModel')


describe('Blog Route', () => {
    let conn;
    let token;

    beforeAll(async () => {
        conn = await connect()

        await userModel.create({ username: 'samsonaltschooler', password: '123412'});

        const loginResponse = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'samsonaltschooler', 
            password: '123412'
        });

        token = loginResponse.body.token;
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should return blogs', async () => {
        // create blog in our db
        await blogModel.create({
            state: 1,
            total_price: 900,
            created_at: moment().toDate(),
            items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
        })

        await blogModel.create({
            state: 1,
            total_price: 900,
            created_at: moment().toDate(),
            items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
        })

        const response = await request(app)
        .get('/orders')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('orders')
        expect(response.body).toHaveProperty('status', true)
    })

    it('should return orders with state 2', async () => {
        // create order in our db
        await OrderModel.create({
            state: 1,
            total_price: 900,
            created_at: moment().toDate(),
            items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
        })

        await blogModel.create({
            state: 2,
            total_price: 900,
            created_at: moment().toDate(),
            items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
        })

        const response = await request(app)
        .get('/orders?state=2')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('orders')
        expect(response.body).toHaveProperty('status', true)
        expect(response.body.orders.every(order => order.state === 2)).toBe(true)
    })
});
