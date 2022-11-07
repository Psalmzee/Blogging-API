const logger = require('../utils/logger')

/**
 * Error handler middleware
 */
module.exports = (error, req, res, next) => {
  logger.error(error)

  if (error.message === 'Data and hash arguments Required!') {
    return res.status(403).json({
      error: 'Please Provide Password',
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'Operation Failed!',
      error: 'Token Expired!'
    })
  }

  if (error.source === 'jwt middleware error') {
    return res.status(403).json({
      status: 'Operation Failed!',
      error: 'Invalid Token',
    })
  }

  if (error.source === 'Creating a Blog') {
    return res.status(400).json({
      status: 'Operation Failed!',
      error: 'Please Provide Valid Details',
      additionalInfo: error,
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      status: 'Operation Failed!',
      error: 'Wrong Id Format!'
    })
  }

  res.status(400).json({
    status: 'Operation Failed!',
    error: error.message,
  })

  next()
}
