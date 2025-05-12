"use client";
import { useState } from "react";
import { useUser } from "@/app/context/user";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const { setToken, setUser } = useUser();

  const doorOptions = [
    "Kavallerigatan 1",
    "Kavallerigatan 3",
    "Kavallerigatan 5",
    "Kavallerigatan 7",
    "Kavallerigatan 9",
    "Kavallerigatan 11",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    const urlEndpoint =
      mode === "login"
        ? "/api/auth/login"
        : mode === "register"
        ? "/api/auth/register"
        : "/api/auth/password-reset";

    const payload =
      mode === "login"
        ? { email, password }
        : mode === "register"
        ? { email, password, firstName, lastName, address, phone }
        : { email, newPassword: password };

    try {
      const res = await fetch(urlEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      if (mode === "reset") {
        setMessage("Lösenordet har uppdaterats. Du kan nu logga in.");
        return;
      }

      setToken(data.token);
      setUser?.(data.user);
      LocalStorageKit.set("user", data.user);
      LocalStorageKit.set("@library/token", data.token);
      LocalStorageKit.set("role", data.role);
      window.dispatchEvent(new Event("storage"));
      onClose();
    } catch (err) {
      setError(err.message);
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
          {mode === "login"
            ? "Logga in"
            : mode === "register"
            ? "Registrera dig"
            : "Återställ lösenord"}
        </h2>

        {error && <p className="modal__error">{error}</p>}
        {message && <p className="modal__success">{message}</p>}

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
            <label htmlFor="password">
              {mode === "reset" ? "Nytt lösenord" : "Lösenord"}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === "login" && (
            <p className="modal__link">
              <button
                type="button"
                className="modal__link-button"
                onClick={() => setMode("reset")}
              >
                Glömt lösenord?
              </button>
            </p>
          )}

          {mode === "reset" && (
            <p className="modal__link">
              <button
                type="button"
                className="modal__link-button"
                onClick={() => setMode("login")}
              >
                Tillbaka till inloggning
              </button>
            </p>
          )}

          {mode === "register" && (
            <>
              <div className="modal__form-content">
                <label>Förnamn</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="modal__form-content">
                <label>Efternamn</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="modal__form-content">
                <label>Port (adress)</label>
                <select
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                >
                  <option value="">-- Välj port --</option>
                  {doorOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal__form-content">
                <label>Telefonnummer</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="modal__submit-button">
            {mode === "login"
              ? "Logga in"
              : mode === "register"
              ? "Registrera"
              : "Återställ lösenord"}
          </button>
        </form>
      </div>
    </div>
  );
}
