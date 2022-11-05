/**
 * Error handler middleware
 */
 module.exports = (error, req, res, next) => {
    if (error.message === 'Data and hash arguments required!') {
      return res.status(403).json({
        error: 'Please provide Password!',
      })
    }
  
    if (error.source === 'JWT middleware error') {
      return res.status(403).json({
        status: false,
        error: 'invalid token',
      })
    }
  
    res.status(400).json({
      error: error.message,
    })
  
    next()
  }
  