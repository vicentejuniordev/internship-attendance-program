import { useState } from 'react'
import CodeInput from '../components/CodeInput'
import ActionButton from '../components/ActionButton'
import FeedbackMessage from '../components/FeedbackMessage'
import { registrarFrequencia } from '../services/api'

function Registro({ onErroCritico }) {
  const [codigo, setCodigo] = useState('')
  const [loadingTipo, setLoadingTipo] = useState(null) // null | 'entrada' | 'saida'
  const [feedback, setFeedback] = useState(null) // { message, variant: 'success' | 'error' }

  // Formato do código único: EST- + 5 caracteres alfanuméricos
  const formatoCodigoValido = /^EST-[A-Z0-9]{5}$/.test((codigo || '').trim())
  const codigoValido = typeof codigo === 'string' && codigo.trim() !== '' && formatoCodigoValido
  const loading = loadingTipo !== null
  const desabilitarBotoes = !codigoValido || loading

  const handleRegistrar = async (tipo) => {
    if (!codigoValido || loading) return
    const codigoNormalizado = codigo.trim().toUpperCase()
    setLoadingTipo(tipo)
    setFeedback(null)
    try {
      const data = await registrarFrequencia(codigoNormalizado, tipo)
      setFeedback({
        message: data.mensagem || (tipo === 'entrada' ? 'Entrada registrada.' : 'Saída registrada.'),
        variant: 'success',
      })
    } catch (err) {
      if (err.critical && onErroCritico) {
        onErroCritico(err.message || 'Não foi possível conectar. Tente novamente.')
        return
      }
      setFeedback({
        message: err.message || 'Ocorreu um erro. Tente novamente.',
        variant: 'error',
      })
    } finally {
      setLoadingTipo(null)
    }
  }

  return (
    <div className="registro">
      <h1 className="registro__titulo">Registro de Frequência Estágio</h1>
      <CodeInput value={codigo} onChange={setCodigo} />
      <div className="registro__botoes">
        <ActionButton
          label="Registrar Entrada"
          onClick={() => handleRegistrar('entrada')}
          loading={loadingTipo === 'entrada'}
          disabled={desabilitarBotoes}
        />
        <ActionButton
          label="Registrar Saída"
          onClick={() => handleRegistrar('saida')}
          loading={loadingTipo === 'saida'}
          disabled={desabilitarBotoes}
        />
      </div>
      <FeedbackMessage message={feedback?.message} variant={feedback?.variant} />
    </div>
  )
}

export default Registro
