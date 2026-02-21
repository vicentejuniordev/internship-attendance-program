const path = require('path')
const fs = require('fs')
const Estagiario = require('./Estagiario')

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

function hojeISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function horaAgoraHHmm() {
  const d = new Date()
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

/**
 * Registra uma frequência (entrada ou saída) para o código informado.
 * Resolve o estagiário pelo código; valida ativo e regras de entrada/saída no dia.
 * @param {string} codigo - Código do estagiário (será normalizado: trim + uppercase)
 * @param {'entrada' | 'saida'} tipo - Tipo do registro
 * @returns {{ mensagem: string }} Objeto com mensagem de sucesso
 * @throws {Error} Se codigo/tipo inválidos, código não encontrado, inativo ou regras do dia violadas
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

  const estagiario = Estagiario.buscarPorCodigo(codigo)
  if (!estagiario) {
    const err = new Error('Código não encontrado.')
    err.statusCode = 400
    throw err
  }
  if (!estagiario.ativo) {
    const err = new Error('Código inativo. Não é possível registrar frequência.')
    err.statusCode = 403
    throw err
  }

  const data = hojeISO()
  const hora = horaAgoraHHmm()
  const registros = readRegistros()

  const registroDoDia = registros.find(
    (r) => r.estagiario_id === estagiario.id && r.data === data
  )

  if (tipo === 'entrada') {
    if (registroDoDia && registroDoDia.hora_entrada) {
      const err = new Error('Já existe entrada registrada para hoje.')
      err.statusCode = 400
      throw err
    }
    if (registroDoDia) {
      registroDoDia.hora_entrada = hora
    } else {
      registros.push({
        id: gerarId(),
        estagiario_id: estagiario.id,
        data,
        hora_entrada: hora,
        hora_saida: null,
      })
    }
    writeRegistros(registros)
    return { mensagem: 'Entrada registrada.' }
  }

  if (tipo === 'saida') {
    if (!registroDoDia || !registroDoDia.hora_entrada) {
      const err = new Error('Registre a entrada antes de registrar a saída.')
      err.statusCode = 400
      throw err
    }
    if (registroDoDia.hora_saida) {
      const err = new Error('Saída já registrada para hoje.')
      err.statusCode = 400
      throw err
    }
    registroDoDia.hora_saida = hora
    writeRegistros(registros)
    return { mensagem: 'Saída registrada.' }
  }

  const err = new Error('Tipo inválido.')
  err.statusCode = 400
  throw err
}

/**
 * Lista todos os registros de frequência (somente leitura).
 * Usado para relatórios.
 * @returns {Array<{ id: string, estagiario_id: number, data: string, hora_entrada: string | null, hora_saida: string | null }>}
 */
function listarRegistros() {
  return readRegistros()
}

module.exports = {
  registrar,
  listarRegistros,
  TIPOS_VALIDOS,
}
