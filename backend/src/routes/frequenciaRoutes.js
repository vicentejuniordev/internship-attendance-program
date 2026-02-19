const express = require('express')
const router = express.Router()
const frequenciaController = require('../controllers/frequenciaController')
const validarFrequencia = require('../middlewares/validarFrequencia')

router.post('/frequencia', validarFrequencia, frequenciaController.registrar)

module.exports = router
