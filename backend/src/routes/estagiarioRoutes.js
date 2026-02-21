const express = require('express')
const router = express.Router()
const estagiarioController = require('../controllers/estagiarioController')

router.post('/estagiarios', estagiarioController.criar)
router.get('/estagiarios', estagiarioController.listar)

module.exports = router
