const TIPOS_VALIDOS = ['entrada', 'saida']

// Formato do código único: EST- + 5 caracteres alfanuméricos
const REGEX_CODIGO = /^EST-[A-Z0-9]{5}$/

/**
 * Middleware que valida o body de POST /frequencia.
 * Espera: { codigo: string, tipo: 'entrada' | 'saida' }
 * Valida formato básico do código (EST-XXXXX).
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
  const normalizado = codigo.trim().toUpperCase()
  if (!REGEX_CODIGO.test(normalizado)) {
    return res.status(400).json({
      mensagem: 'Código deve estar no formato EST-XXXXX (ex.: EST-8F3A2).',
      message: 'Código deve estar no formato EST-XXXXX (ex.: EST-8F3A2).',
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
