"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/app/context/user";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setToken, setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const urlEndpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const response = await fetch(urlEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setToken(data.token);
      setUser?.(data.user);
      LocalStorageKit.set("user", data.user);
      LocalStorageKit.set("@library/token", data.token);
      LocalStorageKit.set("role", data.role);
      window.dispatchEvent(new Event("storage"));
      onClose();


    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal__close" onClick={onClose}>
          Stäng 
        </button>

        <div className="modal__button-containers">
          <button
            className={`modal__toggle ${mode === "login" ? "active" : ""}`}
            onClick={() => setMode("login")}
          >
            Logga in
          </button>
          <button
            className={`modal__toggle ${mode === "register" ? "active" : ""}`}
            onClick={() => setMode("register")}
          >
            Registrera
          </button>
        </div>

        <h2 className="modal__title">
          {mode === "login" ? "Logga in" : "Registrera dig"}
        </h2>

        {error && <p className="modal__error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__form-content">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="modal__form-content">
            <label htmlFor="password">Lösenord</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="modal__submit-button">
            {mode === "login" ? "Logga in" : "Registrera"}
          </button>
        </form>
      </div>
    </div>
  );
}
