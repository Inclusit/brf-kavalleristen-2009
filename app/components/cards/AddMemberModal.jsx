"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import FeedbackMessage from "../ui/FeedbackMessage";
import CTAbtn from "../ui/CTAbtn";
import { boardData } from "../data/boardData";

export default function AddMemberModal({ onClose, onSaved }) {
  const { user } = useUser();
  const role = user?.role;

  const [form, setForm] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fileInputRef = useRef(null);
  const focusRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    const onClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [onClose]);

  useEffect(() => {
    focusRef.current?.focus();
    setFeedback(null);
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file)
      return setFeedback({ type: "error", message: "Ingen fil vald." });
    setFeedback(null);

    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, image: preview }));


    const fd = new FormData();
    fd.append("file", file);
    try {
      setLoading(true);
      const res = await fetch("/api/upload?type=profile", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Uppladdning misslyckades");
      const { url } = await res.json();
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const saveNew = async () => {
    if (!form.name || !form.position || !form.image) {
      setFeedback({
        type: "error",
        message: "Namn, position och bild krävs.",
      });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/board-members", {
        method: "POST",
        headers: { "Content-Type": "application/json", role },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Misslyckades spara medlem");
      const saved = await res.json();
      onSaved(saved);
      onClose();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (role !== "ADMIN") return null;

  return (
    <div className="member-modal__backdrop">
      <div
        className="member-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-member-title"
        ref={modalRef}
      >
        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            className="member-modal__feedback"
          />
        )}

        <h2
          id="add-member-title"
          className="member-modal__title"
          tabIndex="-1"
          ref={focusRef}
        >
          Ny medlem
        </h2>

        <div className="member-modal__edit-group">
          <label htmlFor="name" className="member-modal__label">
            Namn
            <input
             id="name"
                type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Namn"
              required
            />
          </label>

          <label htmlFor="position" className="member-modal__label">
            Styrelseroll
            <select
                id="position"
            type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                -- Välj roll --
              </option>
              {boardData.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="email" className="member-modal__label">
            E-post
            <input
                id="email"
                type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-post"
            />
          </label>

          <label htmlFor="phone" className="member-modal__label">
            Telefon
            <input
                id="phone"
                type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Telefon"
            />
          </label>

          <label htmlFor="image" className="member-modal__label">
            Profilbild
            <input
                id="image"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="member-modal__preview">
          {form.image && (
            <img
              src={form.image}
              alt={`Porträtt av ${form.name || "ny medlem"}`}
              className="member-modal__image-preview"
            />
          )}
        </div>

        <div className="member-modal__controls">
          <CTAbtn
            type="save"
            onClick={saveNew}
            disabled={loading}
            ariaLabel="Spara medlem"
          />
          <CTAbtn type="cancel" onClick={onClose} ariaLabel="Avbryt" />
        </div>
      </div>
    </div>
  );
}
