"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";
import FeedbackMessage from "./FeedbackMessage";

export default function LoginModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const { setToken, setUser } = useUser();
  const modalRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

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
    setFeedbackMessage(null);

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
        setFeedbackMessage({
          type: "success",
          message: "Lösenordet har återställts. Du kan nu logga in.",
        });
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
      setFeedbackMessage({
        type: "error",
        message: err.message || "Något gick fel. Försök igen senare.",
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
      >
        <button
          aria-label="Stäng inloggningsmodal"
          className="modal__close"
          onClick={onClose}
        >
          X
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

        <h2
          id="modal-title"
          className="modal__title"
          tabIndex="-1"
          ref={focusRef}
        >
          {mode === "login"
            ? "Logga in"
            : mode === "register"
            ? "Registrera dig"
            : "Återställ lösenord"}
        </h2>

        {feedbackMessage && (
          <FeedbackMessage
            type={feedbackMessage.type}
            message={feedbackMessage.message}
            onClose={() => setFeedbackMessage(null)}
          />
        )}

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
                <label htmlFor="firstName">Förnamn</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="modal__form-content">
                <label htmlFor="lastName">Efternamn</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="modal__form-content">
                <label htmlFor="address">Port (adress)</label>
                <select
                  id="address"
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
                <label htmlFor="phone">Telefonnummer</label>
                <input
                  type="tel"
                  id="phone"
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
