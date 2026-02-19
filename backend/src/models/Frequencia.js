const path = require('path')
const fs = require('fs')

const DATA_DIR = path.join(__dirname, '../../data')
const DATA_FILE = path.join(DATA_DIR, 'frequencias.json')

const TIPOS_VALIDOS = ['entrada', 'saida']

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8')
  }
}

function readRegistros() {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeRegistros(registros) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(registros, null, 2), 'utf8')
}

/**
 * Registra uma frequência (entrada ou saída) para o código informado.
 * @param {string} codigo - Código do estagiário (já normalizado: trim + uppercase)
 * @param {'entrada' | 'saida'} tipo - Tipo do registro
 * @returns {{ mensagem: string }} Objeto com mensagem de sucesso
 * @throws {Error} Se codigo ou tipo forem inválidos
 */
function registrar(codigo, tipo) {
  if (!codigo || typeof codigo !== 'string' || codigo.trim() === '') {
    const err = new Error('Código inválido.')
    err.statusCode = 400
    throw err
  }
  if (!TIPOS_VALIDOS.includes(tipo)) {
    const err = new Error('Tipo deve ser "entrada" ou "saida".')
    err.statusCode = 400
    throw err
  }

  const registros = readRegistros()
  const registro = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    codigo: codigo.trim().toUpperCase(),
    tipo,
    dataHora: new Date().toISOString(),
  }
  registros.push(registro)
  writeRegistros(registros)

  const mensagem =
    tipo === 'entrada' ? 'Entrada registrada.' : 'Saída registrada.'
  return { mensagem }
}

module.exports = {
  registrar,
  TIPOS_VALIDOS,
}
