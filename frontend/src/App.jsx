import { useState } from 'react'
import Registro from './pages/Registro'
import TelaErro from './components/TelaErro'

function App() {
  const [erroCritico, setErroCritico] = useState(null)

  if (erroCritico) {
    return (
      <main className="app">
        <TelaErro mensagem={erroCritico} onTentarNovamente={() => setErroCritico(null)} />
      </main>
    )
  }

  return (
    <main className="app">
      <Registro onErroCritico={setErroCritico} />
    </main>
  )
}

export default App
