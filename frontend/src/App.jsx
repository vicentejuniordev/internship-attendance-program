import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom'
import Registro from './pages/Registro'
import Relatorios from './pages/Relatorios'
import TelaErro from './components/TelaErro'

function Nav() {
  return (
    <nav className="app-nav" aria-label="Navegação principal">
      <NavLink to="/" className={({ isActive }) => `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`} end>
        Registro
      </NavLink>
      <NavLink to="/relatorios" className={({ isActive }) => `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`}>
        Relatórios
      </NavLink>
    </nav>
  )
}

function AppLayout({ onErroCritico }) {
  return (
    <>
      <Nav />
      <Outlet context={{ onErroCritico }} />
    </>
  )
}

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
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout onErroCritico={setErroCritico} />}>
            <Route path="/" element={<Registro onErroCritico={setErroCritico} />} />
            <Route path="/relatorios" element={<Relatorios onErroCritico={setErroCritico} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App
