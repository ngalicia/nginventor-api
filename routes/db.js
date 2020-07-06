const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'DBProyecto2',
  password: '1234',
  port: 5432,
  max: 5,
  idleTimeoutMillis: 5000,
})

module.exports = pool
