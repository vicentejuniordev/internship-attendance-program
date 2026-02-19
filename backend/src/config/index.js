require('dotenv').config()

const PORT = Number(process.env.PORT) || 3000
const CORS_ORIGIN = process.env.CORS_ORIGIN || ''

module.exports = {
  PORT,
  CORS_ORIGIN,
}
