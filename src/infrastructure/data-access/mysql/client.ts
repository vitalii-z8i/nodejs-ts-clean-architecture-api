import mysql from 'mysql2/promise'
import { app } from '../../../config'

const client = mysql.createPool({
  host: app.database.host,
  port: app.database.port,
  user: app.database.user,
  password: app.database.password,
  database: app.database.dbName,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
})

export default client
