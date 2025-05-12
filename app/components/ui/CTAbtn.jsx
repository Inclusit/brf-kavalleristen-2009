"use client";
import { useState } from "react";

export default function CTAbtn({ type, onClick, role }) {
  const [loading, setLoading] = useState(false);

  if (type === "delete" && role !== "ADMIN") {
    return null;
  }

  const labelMap = {
    delete: "Radera",
    edit: "Uppdatera",
    save: "Spara",
    cancel: "Avbryt",
    post: "Publicera nyhet",
    publish: "Skapa ny nyhet",
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
    if (type === "delete") {
      const confirmDelete = window.confirm(
        "Är du säker på att du vill radera denna nyhet?"
      );
      if (!confirmDelete) return;
    }

    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className={classMap[type]} onClick={handleClick} disabled={loading}>
      {loading && <span className="cta-btn__spinner" />}
      {labelMap[type]}
    </button>
  );
}
