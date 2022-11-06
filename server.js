const http = require('http')
const app = require('./app')
require("dotenv").config();
const Database = require('./database/db');
const PORT = process.env.PORT || 9002


//connect to mongodb database
Database.connectToMongoDB();

const server = http.createServer(app)
server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))


