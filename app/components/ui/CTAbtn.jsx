"use client";
import { useState } from "react";

export default function CTAbtn({
  type,
  onClick,
  role,
  ariaLabel,
  confirmMessage,
}) {
  const [loading, setLoading] = useState(false);

  if (type === "delete" && role !== "ADMIN") {
    return null;
  }

  const labelMap = {
    delete: "Radera",
    edit: "Uppdatera",
    save: "Spara",
    cancel: "Avbryt",
    post: "Publicera",
    publish: "Skapa nyhet",
  };

  const classMap = {
    delete: "cta-btn cta-btn--delete",
    edit: "cta-btn cta-btn--edit",
    save: "cta-btn cta-btn--save",
    cancel: "cta-btn cta-btn--cancel",
    post: "cta-btn cta-btn--post",
    publish: "cta-btn cta-btn--publish",
  };

  const handleClick = async () => {
    if (type === "delete" && confirmMessage) {
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;
    }

    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={classMap[type]}
      onClick={handleClick}
      disabled={loading}
      aria-label={ariaLabel || labelMap[type]}
      aria-busy={loading}
    >
      {loading && (
        <span className="cta-btn__spinner" aria-hidden="true" role="status" />
      )}
      {labelMap[type]}
    </button>
  );
}
