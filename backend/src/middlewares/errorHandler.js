/**
 * Middleware de erro global: formata erros como JSON { mensagem } / { message }
 * para compatibilidade com o frontend. Usa statusCode do erro ou 500.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500
  const mensagem =
    err.message || 'Ocorreu um erro interno. Tente novamente.'
  res.status(statusCode).json({
    mensagem,
    message: mensagem,
  })
}

module.exports = errorHandler
