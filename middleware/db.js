const mongoose = require('mongoose')
const logger = require('../utils/logger')


module.exports = (URI) => {
  mongoose
    .connect(URI)
    .then(() => {
      logger.info('Connection to MongoDB Successful!')
    })
    .catch((err) => {
      logger.error('Connection to MongoDB Failed!', err.message)
    })
}
