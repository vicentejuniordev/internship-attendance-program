import { useState, useEffect, useMemo } from 'react'
import { buscarRelatorioSemanal } from '../services/api'
import FeedbackMessage from '../components/FeedbackMessage'

function primeiroDiaDoMes(ano, mes) {
  return `${ano}-${String(mes).padStart(2, '0')}-01`
}

function ultimoDiaDoMes(ano, mes) {
  const d = new Date(ano, Number(mes), 0)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Converte por_estagiario em estrutura por semana: mapa data_inicio -> { data_inicio, data_fim, itens }.
 * itens = [ { nome, codigo, total_horas, dias } ], ordenado por data_inicio da semana.
 */
function agruparPorSemana(porEstagiario) {
  const porSemana = new Map()
  for (const est of porEstagiario || []) {
    for (const s of est.semanas || []) {
      const key = s.data_inicio
      if (!porSemana.has(key)) {
        porSemana.set(key, {
          data_inicio: s.data_inicio,
          data_fim: s.data_fim,
          itens: [],
        })
      }
      porSemana.get(key).itens.push({
        nome: est.nome,
        codigo: est.codigo,
        total_horas: s.total_horas,
        dias: s.dias || [],
      })
    }
  }
  const semanasOrdenadas = Array.from(porSemana.values()).sort((a, b) =>
    a.data_inicio.localeCompare(b.data_inicio)
  )
  return semanasOrdenadas
}

function formatarDataBR(iso) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function Relatorios({ onErroCritico }) {
  const now = useMemo(() => new Date(), [])
  const [ano, setAno] = useState(now.getFullYear())
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [dados, setDados] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [expandido, setExpandido] = useState(null) // 'estagiario_id-semana_inicio' ou null

  const dataInicio = useMemo(() => primeiroDiaDoMes(ano, mes), [ano, mes])
  const dataFim = useMemo(() => ultimoDiaDoMes(ano, mes), [ano, mes])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErro(null)
    setDados(null)

    buscarRelatorioSemanal({ dataInicio, dataFim })
      .then((res) => {
        if (cancelled) return
        setDados(res)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        if (err.critical && onErroCritico) {
          onErroCritico(err.message || 'Não foi possível conectar. Tente novamente.')
          return
        }
        setErro(err.message || 'Ocorreu um erro. Tente novamente.')
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [dataInicio, dataFim, onErroCritico])

  const semanas = useMemo(() => agruparPorSemana(dados?.por_estagiario), [dados])

  const anosDisponiveis = useMemo(() => {
    const atual = new Date().getFullYear()
    return Array.from({ length: 4 }, (_, i) => atual - 2 + i)
  }, [])

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ]

  return (
    <div className="relatorios">
      <h1 className="relatorios__titulo">Relatórios Semanais</h1>

      <div className="relatorios__filtro">
        <label className="relatorios__label" htmlFor="relatorios-mes">
          Mês
        </label>
        <select
          id="relatorios-mes"
          className="relatorios__select"
          value={mes}
          onChange={(e) => setMes(Number(e.target.value))}
          aria-label="Selecionar mês"
        >
          {mesesNomes.map((nome, i) => (
            <option key={i} value={i + 1}>
              {nome}
            </option>
          ))}
        </select>
        <label className="relatorios__label" htmlFor="relatorios-ano">
          Ano
        </label>
        <select
          id="relatorios-ano"
          className="relatorios__select"
          value={ano}
          onChange={(e) => setAno(Number(e.target.value))}
          aria-label="Selecionar ano"
        >
          {anosDisponiveis.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="relatorios__loading" role="status" aria-live="polite">
          Carregando relatório…
        </p>
      )}

      <FeedbackMessage message={erro || null} variant="error" />

      {!loading && !erro && semanas.length === 0 && (
        <p className="relatorios__vazio">Nenhum registro de frequência neste período.</p>
      )}

      {!loading && !erro && semanas.length > 0 && (
        <div className="relatorios__semanas">
          {semanas.map((semana) => (
            <section
              key={semana.data_inicio}
              className="relatorios__semana"
              aria-labelledby={`semana-${semana.data_inicio}`}
            >
              <h2 id={`semana-${semana.data_inicio}`} className="relatorios__semana-titulo">
                {formatarDataBR(semana.data_inicio)} – {formatarDataBR(semana.data_fim)}
              </h2>
              <div className="relatorios__tabela-wrapper">
                <table className="relatorios__tabela">
                  <thead>
                    <tr>
                      <th scope="col">Estagiário</th>
                      <th scope="col">Código</th>
                      <th scope="col">Total (h)</th>
                      <th scope="col" aria-label="Expandir detalhes" />
                    </tr>
                  </thead>
                  <tbody>
                    {semana.itens.map((item) => {
                      const chave = `${item.codigo}-${semana.data_inicio}`
                      const estaExpandido = expandido === chave
                      return (
                        <tr key={chave}>
                          <td>{item.nome ?? '—'}</td>
                          <td>{item.codigo ?? '—'}</td>
                          <td>{item.total_horas}</td>
                          <td>
                            {item.dias.length > 0 ? (
                              <button
                                type="button"
                                className="relatorios__expandir"
                                onClick={() => setExpandido(estaExpandido ? null : chave)}
                                aria-expanded={estaExpandido}
                                aria-controls={`detalhes-${chave}`}
                              >
                                {estaExpandido ? 'Ocultar' : 'Ver dias'}
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              {semana.itens.map((item) => {
                const chave = `${item.codigo}-${semana.data_inicio}`
                const estaExpandido = expandido === chave
                if (!estaExpandido || !item.dias.length) return null
                return (
                  <div
                    key={chave}
                    id={`detalhes-${chave}`}
                    className="relatorios__detalhes"
                    role="region"
                    aria-label={`Detalhes por dia: ${item.nome || item.codigo}`}
                  >
                    <table className="relatorios__tabela relatorios__tabela--detalhes">
                      <thead>
                        <tr>
                          <th scope="col">Data</th>
                          <th scope="col">Entrada</th>
                          <th scope="col">Saída</th>
                          <th scope="col">Horas</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.dias.map((dia) => (
                          <tr key={dia.data}>
                            <td>{formatarDataBR(dia.data)}</td>
                            <td>{dia.hora_entrada ?? '—'}</td>
                            <td>{dia.hora_saida ?? '—'}</td>
                            <td>{dia.horas ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default Relatorios
