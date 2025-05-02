"use client";

import React from "react";

export default function LoginModal({ onClose }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          Stäng
        </button>
        <h2>Logga in / Registrera</h2>
        {/* Här bygger vi vidare med formulär */}
      </div>
    </div>
  );
}
