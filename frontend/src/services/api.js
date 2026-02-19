const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

const MENSAGEM_ERRO_REDE = 'Não foi possível conectar. Tente novamente.'

/**
 * Registra entrada ou saída do estagiário.
 * @param {string} codigo - Código do estagiário
 * @param {'entrada' | 'saida'} tipo - Tipo do registro
 * @returns {Promise<{ status: string, mensagem: string }>} Dados da resposta em caso de sucesso
 * @throws {Error} Erro com mensagem amigável em caso de falha (4xx/5xx ou rede)
 */
export async function registrarFrequencia(codigo, tipo) {
  const url = BASE_URL ? `${BASE_URL}/frequencia` : '/frequencia'

  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, tipo }),
    })
  } catch (_) {
    const err = new Error(MENSAGEM_ERRO_REDE)
    err.critical = true
    throw err
  }

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg =
      data.mensagem || data.message || (res.status >= 500 ? MENSAGEM_ERRO_REDE : 'Ocorreu um erro. Tente novamente.')
    const err = new Error(msg)
    if (res.status >= 500) err.critical = true
    throw err
  }

  return data
}
