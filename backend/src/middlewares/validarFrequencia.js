const TIPOS_VALIDOS = ['entrada', 'saida']

/**
 * Middleware que valida o body de POST /frequencia.
 * Espera: { codigo: string, tipo: 'entrada' | 'saida' }
 * Retorna 400 com { mensagem } em caso de erro (frontend também lê "message").
 */
function validarFrequencia(req, res, next) {
  const { codigo, tipo } = req.body || {}

  if (codigo === undefined || codigo === null) {
    return res.status(400).json({
      mensagem: 'O campo "codigo" é obrigatório.',
      message: 'O campo "codigo" é obrigatório.',
    })
  }
  if (typeof codigo !== 'string' || codigo.trim() === '') {
    return res.status(400).json({
      mensagem: 'Código inválido.',
      message: 'Código inválido.',
    })
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return res.status(400).json({
      mensagem: 'O campo "tipo" deve ser "entrada" ou "saida".',
      message: 'O campo "tipo" deve ser "entrada" ou "saida".',
    })
  }

  next()
}

module.exports = validarFrequencia
