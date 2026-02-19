function TelaErro({ mensagem, onTentarNovamente }) {
  return (
    <div className="tela-erro" role="alert">
      <p className="tela-erro__mensagem">{mensagem}</p>
      <button
        type="button"
        onClick={onTentarNovamente}
        className="action-button tela-erro__botao"
        aria-label="Tentar novamente"
      >
        Tentar novamente
      </button>
    </div>
  )
}

export default TelaErro
