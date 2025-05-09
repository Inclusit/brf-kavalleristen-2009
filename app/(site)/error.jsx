"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Client-side error:", error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-page__message">
        <h1 className="error-page__title">Ojdå!</h1>
        <p>Det verkar som att något gick fel. Försök igen senare.</p>
      </div>
      <button className="error-page__reset-btn" onClick={() => reset()}>
        Försök igen
      </button>
    </div>
  );
}
