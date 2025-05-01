"use client";

import { useState } from "react";
import LocalStorageKit from "../lib/utils/localStorageKit";

export default function RoleTestComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Du måste fylla i både e-post och lösenord");
      return;
    }

    try {
      console.log("Skickar inloggning:", { email, password });

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Fel vid inloggning");
        return;
      }

      const token = data.token;
      LocalStorageKit.set("@library/token", token);

      const userRes = await fetch("/api/users/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userData = await userRes.json();
      if (!userRes.ok) {
        setError("Kunde inte hämta användardata");
        return;
      }

      setUser(userData);
    } catch (err) {
      setError("Något gick fel");
    }
  };


  if (!user) {
    return (
      <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <h2>Logga in</h2>
        <input
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} style={{ padding: "8px 16px" }}>
          Logga in
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.email}</h2>
      <p>
         <strong>{user.role}</strong>
      </p>

      <div style={{ marginTop: "20px" }}>
        <p></p>
        <ul>
          <li>Publik information</li>
        </ul>

        {(user.role === "MODERATOR" || user.role === "ADMIN") && (
          <div>
            <p style={{ fontWeight: "bold" }}>Moderator/admin:</p>
            <ul>
              <li>Redigera innehåll</li>
            </ul>
          </div>
        )}

        {user.role === "ADMIN" && (
          <div>
            <p style={{ fontWeight: "bold", color: "darkred" }}>
              Endast admin:
            </p>
            <ul>
              <li>Hantera användare</li>
              <li>Systemloggar</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
