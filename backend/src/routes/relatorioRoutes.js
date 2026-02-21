const express = require('express')
const relatorioController = require('../controllers/relatorioController')

const router = express.Router()

router.get('/relatorio/semanal', relatorioController.relatorioSemanal)

module.exports = router
