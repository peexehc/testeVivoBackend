const mysql = require('mysql')

const pool = mysql.createPool({
  connectionLimit: 10,
  host: '186.202.152.117',
  user: 'tt_telefonica',
  password: 't3st3@v1v0',
  database: 'tt_telefonica'
})

console.log('\nConnection pool created!\n')

pool.on('release', () => console.log('\nPool: connection released'))

process.on('SIGINT', () =>
  pool.end(error => {
    if (error) return console.log(error)

    console.log('\nPool: connection closed!\n')

    process.exit(0)
  })
)

module.exports = pool
