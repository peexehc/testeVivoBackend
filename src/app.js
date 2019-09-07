const express = require('express')
const app = express()
const server = require('http').Server(app)
const db = require('./config/database')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const port = 3000

db.connect((error) => {
  if (error) {
    throw error
  }

  console.log('Connected to database')
})

global.db = db

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(routes)

server.listen(port, () => console.log(`App listening on http://127.0.0.1:${port}`))
