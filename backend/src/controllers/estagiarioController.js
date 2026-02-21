const Estagiario = require('../models/Estagiario')

/**
 * POST /estagiarios
 * Body: { nome: string }
 * Resposta: 201 { estagiario }
 */
function criar(req, res, next) {
  try {
    const { nome } = req.body || {}
    const estagiario = Estagiario.criar({ nome })
    res.status(201).json({ estagiario })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /estagiarios
 * Resposta: 200 { estagiarios }
 */
function listar(req, res, next) {
  try {
    const estagiarios = Estagiario.listar()
    res.status(200).json({ estagiarios })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  criar,
  listar,
}
