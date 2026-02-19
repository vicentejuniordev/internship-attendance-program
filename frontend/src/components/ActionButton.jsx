function ActionButton({ label, onClick, loading = false, disabled = false, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="action-button"
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...rest}
    >
      {loading ? "Enviando..." : label}
    </button>
  );
}

export default ActionButton;
