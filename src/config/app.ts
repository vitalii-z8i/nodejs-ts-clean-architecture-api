export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwtSecret: process.env.APP_JWT_SECRET,
    database: {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER as string,
      password: process.env.DB_PASS as string,
      dbName: process.env.DB_NAME as string,
    }
}
