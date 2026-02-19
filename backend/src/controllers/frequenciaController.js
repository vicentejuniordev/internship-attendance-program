const Frequencia = require('../models/Frequencia')

/**
 * POST /frequencia
 * Body: { codigo: string, tipo: 'entrada' | 'saida' }
 * Resposta: { mensagem } ou { status, mensagem }
 */
function registrar(req, res, next) {
  try {
    const { codigo, tipo } = req.body
    const resultado = Frequencia.registrar(codigo, tipo)
    res.status(201).json({
      status: 'ok',
      mensagem: resultado.mensagem,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  registrar,
}
