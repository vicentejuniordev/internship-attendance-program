const path = require('path')
const fs = require('fs')

const DATA_DIR = path.join(__dirname, '../../data')
const DATA_FILE = path.join(DATA_DIR, 'estagiarios.json')

const PREFIXO_CODIGO = 'EST-'
const TAMANHO_SUFIXO = 5
const CARACTERES = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8')
  }
}

function readEstagiarios() {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, 'utf8')
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeEstagiarios(estagiarios) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(estagiarios, null, 2), 'utf8')
}

function gerarSufixoAleatorio() {
  let sufixo = ''
  for (let i = 0; i < TAMANHO_SUFIXO; i++) {
    sufixo += CARACTERES.charAt(Math.floor(Math.random() * CARACTERES.length))
  }
  return sufixo
}

/**
 * Gera um código único no formato EST-XXXXX.
 * Garante unicidade consultando os estagiários já persistidos.
 * @returns {string} Código no formato EST-XXXXX
 */
function gerarCodigoUnico() {
  const existentes = readEstagiarios()
  const codigosUsados = new Set(existentes.map((e) => e.codigo))

  let codigo
  let tentativas = 0
  const maxTentativas = 100
  do {
    codigo = PREFIXO_CODIGO + gerarSufixoAleatorio()
    if (++tentativas > maxTentativas) {
      const err = new Error('Não foi possível gerar um código único.')
      err.statusCode = 500
      throw err
    }
  } while (codigosUsados.has(codigo))

  return codigo
}

/**
 * Cria um novo estagiário com código gerado automaticamente.
 * @param {{ nome: string }} dados - Nome do estagiário
 * @returns {{ id: number, nome: string, codigo: string, ativo: boolean, criado_em: string }}
 */
function criar(dados) {
  const nome =
    typeof dados.nome === 'string' ? dados.nome.trim() : ''
  if (nome === '') {
    const err = new Error('O nome é obrigatório.')
    err.statusCode = 400
    throw err
  }

  const estagiarios = readEstagiarios()
  const id =
    estagiarios.length === 0
      ? 1
      : Math.max(...estagiarios.map((e) => e.id), 0) + 1
  const codigo = gerarCodigoUnico()
  const criado_em = new Date().toISOString()

  const estagiario = {
    id,
    nome,
    codigo,
    ativo: true,
    criado_em,
  }
  estagiarios.push(estagiario)
  writeEstagiarios(estagiarios)

  return estagiario
}

/**
 * Busca estagiário pelo código (normalizado: trim + uppercase).
 * @param {string} codigo - Código do estagiário
 * @returns {object | null} Estagiário ou null se não encontrado
 */
function buscarPorCodigo(codigo) {
  if (!codigo || typeof codigo !== 'string') return null
  const normalizado = codigo.trim().toUpperCase()
  if (normalizado === '') return null
  const estagiarios = readEstagiarios()
  return estagiarios.find((e) => e.codigo === normalizado) || null
}

/**
 * Lista todos os estagiários.
 * @returns {Array<object>}
 */
function listar() {
  return readEstagiarios()
}

/**
 * Atualiza o campo ativo do estagiário.
 * @param {number} id - ID do estagiário
 * @param {boolean} ativo
 * @returns {object | null} Estagiário atualizado ou null se não encontrado
 */
function atualizarAtivo(id, ativo) {
  const estagiarios = readEstagiarios()
  const index = estagiarios.findIndex((e) => e.id === id)
  if (index === -1) return null
  estagiarios[index].ativo = Boolean(ativo)
  writeEstagiarios(estagiarios)
  return estagiarios[index]
}

module.exports = {
  criar,
  buscarPorCodigo,
  listar,
  atualizarAtivo,
  gerarCodigoUnico,
}
