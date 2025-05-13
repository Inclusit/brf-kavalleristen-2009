"use client";

export default function FeedbackMessage({
  type = "error",
  message,
  className = "",
}) {
  if (!message) return null;

  const baseClass = "feedback-message";
  const typeClass = {
    error: "feedback-message--error",
    success: "feedback-message--success",
    info: "feedback-message--info",
  };

  const ariaLive = type === "error" ? "assertive" : "polite";

  return (
    <p
      className={`${baseClass} ${typeClass[type]} ${className}`}
      role={type === "error" ? "alert" : undefined}
      aria-live={ariaLive}
    >
      {message}
    </p>
  );
}
