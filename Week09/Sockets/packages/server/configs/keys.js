module.exports = {
  port: process.env.PORT || 8080,
  db: {
    url: process.env.DB_URL || 'mongodb://localhost/socket-demo'
  },
  secrets: {
    jwt: process.env.JWT_SECRET || 'oneeyedonehornedflyingpurplepeopleeater'
  }
}