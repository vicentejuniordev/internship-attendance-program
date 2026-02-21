function CodeInput({ value = "", onChange, id = "codigo", label = "Código", ...rest }) {
  const handleChange = (e) => {
    const raw = e.target.value;
    const normalized = raw.trim().toUpperCase();
    onChange(normalized);
  };

  return (
    <div className="code-input__wrapper">
      <label htmlFor={id} className="code-input__label">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Ex.: EST-8F3A2"
        className="code-input"
        autoComplete="off"
        aria-required="true"
        aria-invalid={typeof value === "string" && value.trim() === ""}
        {...rest}
      />
    </div>
  );
}

export default CodeInput;
