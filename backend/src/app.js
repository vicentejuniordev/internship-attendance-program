const express = require('express')
const cors = require('cors')
const { CORS_ORIGIN } = require('./config')
const frequenciaRoutes = require('./routes/frequenciaRoutes')
const estagiarioRoutes = require('./routes/estagiarioRoutes')
const relatorioRoutes = require('./routes/relatorioRoutes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

const corsOptions = CORS_ORIGIN
  ? { origin: CORS_ORIGIN }
  : { origin: true }
app.use(cors(corsOptions))
app.use(express.json())

app.use('/', frequenciaRoutes)
app.use('/', estagiarioRoutes)
app.use('/', relatorioRoutes)

app.use(errorHandler)

module.exports = app
