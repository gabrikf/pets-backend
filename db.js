const mysql = require('mysql2/promise')
require('dotenv').config()


//with connection pool
module.exports = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port:process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}) 

// module.exports = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port:process.env.DB_PORT,
// })  
