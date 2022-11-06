module.exports = (req, res, next) => {
  res.status(404).json({ status: 'Operation Failed!', error: 'You have hit an unknown Endpoint!' })
  next()
}
