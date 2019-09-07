const mysql = require('mysql')

const db = mysql.createConnection({
  host: '186.202.152.117',
  user: 'tt_telefonica',
  password: 't3st3@v1v0',
  database: 'tt_telefonica'
})

module.exports = db
