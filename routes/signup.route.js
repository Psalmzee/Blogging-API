const router = require('express').Router()
const { createUser } = require('../controllers/users.controller')

router.route('/').post(createUser)

module.exports = router
