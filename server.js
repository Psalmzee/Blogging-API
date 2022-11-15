const http = require('http')
const app = require('./app')
const { PORT } = require('./config/config')

const server = http.createServer(app)
server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`))
