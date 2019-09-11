const express = require('express')
const app = express()
const server = require('http').Server(app)
const routes = require('./routes')
const port = 3000

app.use(routes)

server.listen(port, () => console.log(`App listening on http://127.0.0.1:${port}`))
