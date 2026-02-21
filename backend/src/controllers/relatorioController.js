const Frequencia = require('../models/Frequencia')
const Estagiario = require('../models/Estagiario')

/**
 * Retorna o ano e o número da semana ISO (segunda = início) para uma data YYYY-MM-DD.
 * @param {string} dataStr - Data no formato YYYY-MM-DD
 * @returns {{ ano: number, semana: number, dataInicio: string, dataFim: string }}
 */
function obterSemanaISO(dataStr) {
  const [y, m, d] = dataStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay() // 1 = segunda, 7 = domingo
  const segunda = new Date(date)
  segunda.setDate(date.getDate() - (dayOfWeek - 1))
  const domingo = new Date(segunda)
  domingo.setDate(segunda.getDate() + 6)

  const quinta = new Date(date)
  quinta.setDate(date.getDate() + 4 - dayOfWeek)
  const ano = quinta.getFullYear()
  const jan1 = new Date(ano, 0, 1)
  const semana = 1 + Math.floor((quinta - jan1) / (7 * 24 * 60 * 60 * 1000))
  const semanaNum = Math.max(1, Math.min(53, semana))

  const fmt = (d) => {
    const ye = d.getFullYear()
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const da = String(d.getDate()).padStart(2, '0')
    return `${ye}-${mo}-${da}`
  }

  return {
    ano,
    semana: semanaNum,
    dataInicio: fmt(segunda),
    dataFim: fmt(domingo),
  }
}

/**
 * Calcula a duração em horas (decimal) entre hora_entrada e hora_saída (formato "HH:mm").
 * Se hora_saida < hora_entrada, considera que a saída é no dia seguinte (ex.: turno noturno).
 * @param {string} horaEntrada - Ex.: "09:00"
 * @param {string} horaSaida - Ex.: "17:30"
 * @returns {number} Horas com decimais (ex.: 8.5)
 */
function calcularHorasEntre(horaEntrada, horaSaida) {
  const [heH, heM] = horaEntrada.split(':').map(Number)
  const [hsH, hsM] = horaSaida.split(':').map(Number)
  let minutosEntrada = heH * 60 + heM
  let minutosSaida = hsH * 60 + hsM
  if (minutosSaida < minutosEntrada) {
    minutosSaida += 24 * 60
  }
  const minutos = minutosSaida - minutosEntrada
  return Math.round((minutos / 60) * 100) / 100
}

/**
 * GET /relatorio/semanal
 * Query opcionais: dataInicio (YYYY-MM-DD), dataFim (YYYY-MM-DD).
 * Se não informado, considera todos os registros disponíveis.
 * Resposta: JSON com agrupamento por estagiário e por semana, com total de horas.
 */
function relatorioSemanal(req, res, next) {
  try {
    const registros = Frequencia.listarRegistros()
    const estagiarios = Estagiario.listar()
    const porId = Object.fromEntries(estagiarios.map((e) => [e.id, e]))

    const dataInicio = req.query.dataInicio || null
    const dataFim = req.query.dataFim || null

    const registrosComHoras = registros
      .filter((r) => r.hora_entrada && r.hora_saida)
      .map((r) => ({
        ...r,
        horas: calcularHorasEntre(r.hora_entrada, r.hora_saida),
        semana: obterSemanaISO(r.data),
      }))
      .filter((r) => {
        if (!dataInicio && !dataFim) return true
        if (dataInicio && r.data < dataInicio) return false
        if (dataFim && r.data > dataFim) return false
        return true
      })

    const porEstagiarioSemana = new Map()

    for (const r of registrosComHoras) {
      const key = `${r.estagiario_id}-${r.semana.ano}-${r.semana.semana}`
      if (!porEstagiarioSemana.has(key)) {
        porEstagiarioSemana.set(key, {
          estagiario_id: r.estagiario_id,
          ano: r.semana.ano,
          semana: r.semana.semana,
          data_inicio: r.semana.dataInicio,
          data_fim: r.semana.dataFim,
          total_horas: 0,
          dias: [],
        })
      }
      const bloco = porEstagiarioSemana.get(key)
      bloco.total_horas += r.horas
      bloco.dias.push({
        data: r.data,
        hora_entrada: r.hora_entrada,
        hora_saida: r.hora_saida,
        horas: r.horas,
      })
    }

    const porEstagiario = new Map()
    for (const [, bloco] of porEstagiarioSemana) {
      const id = bloco.estagiario_id
      if (!porEstagiario.has(id)) {
        const est = porId[id]
        porEstagiario.set(id, {
          estagiario_id: id,
          nome: est ? est.nome : null,
          codigo: est ? est.codigo : null,
          semanas: [],
        })
      }
      const item = porEstagiario.get(id)
      item.semanas.push({
        ano: bloco.ano,
        semana: bloco.semana,
        data_inicio: bloco.data_inicio,
        data_fim: bloco.data_fim,
        total_horas: Math.round(bloco.total_horas * 100) / 100,
        dias: bloco.dias.sort((a, b) => a.data.localeCompare(b.data)),
      })
    }

    const por_estagiario = Array.from(porEstagiario.values()).map((e) => ({
      ...e,
      semanas: e.semanas.sort(
        (a, b) => a.ano - b.ano || a.semana - b.semana
      ),
    }))

    res.json({
      relatorio: 'semanal',
      gerado_em: new Date().toISOString(),
      periodo: dataInicio || dataFim
        ? { data_inicio: dataInicio || null, data_fim: dataFim || null }
        : null,
      por_estagiario,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  relatorioSemanal,
}
