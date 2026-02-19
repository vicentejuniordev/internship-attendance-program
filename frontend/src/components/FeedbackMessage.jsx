function FeedbackMessage({ message, variant = "success" }) {
  if (!message) return null;

  const className = [
    "feedback-message",
    variant === "error" ? "feedback-message--error" : "feedback-message--success",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="status"
      aria-live="polite"
      className={className}
    >
      {message}
    </div>
  );
}

export default FeedbackMessage;
