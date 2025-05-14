"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import CTAbtn from "../ui/CTAbtn";
import FeedbackMessage from "../ui/FeedbackMessage";
import SkeletonLoader from "../ui/SkeletonLoader";
import { boardData } from "../data/boardData";

export default function ProfileCard({ memberId, onDeleted, onUpdated }) {
  const { user } = useUser();
  const role = user?.role;

  const [form, setForm] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);
  const focusRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/board-members/${memberId}`);
        if (!res.ok) throw new Error("Misslyckades hämta medlem");
        const data = await res.json();
        setForm(data);
      } catch (err) {
        setFeedback({ type: "error", message: err.message });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [memberId]);

  useEffect(() => {
    if (!isEditing) return;
    const onKey = (e) => e.key === "Escape" && closeEdit();
    const onClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeEdit();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) focusRef.current?.focus();
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

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
      const res = await fetch("/api/upload?type=profile", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Uppladdning misslyckades");
      const { url } = await res.json();
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const saveChanges = async () => {
    setFeedback(null);
    try {
      const res = await fetch(`/api/board-members/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", role },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Misslyckades att spara");
      const updated = await res.json();
      setForm(updated);
      setIsEditing(false);
      onUpdated?.(updated);
      setFeedback({ type: "success", message: "Sparat!" });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const deleteMember = async () => {
    if (!confirm("Är du säker på att du vill ta bort medlemmen?")) return;
    try {
      const res = await fetch(`/api/board-members/${memberId}`, {
        method: "DELETE",
        headers: { role },
      });
      if (!res.ok) throw new Error("Misslyckades att ta bort");
      onDeleted?.(memberId);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const closeEdit = () => {
    setIsEditing(false);
    setFeedback(null);
  };

  if (loading) {
    return (
      <div className="profile-card" aria-busy="true">
        <SkeletonLoader count={7} />
      </div>
    );
  }

  return (
    <article className="profile-card">

      {!isEditing && (
        <div className="profile-card__view">
          <img
            className="profile-card__avatar"
            src={form.image}
            alt={`Porträtt av ${form.name}`}
          />
          <h3 className="profile-card__name">{form.name}</h3>
          <p className="profile-card__position">{form.position}</p>
          <p className="profile-card__email">{form.email}</p>
          <p className="profile-card__phone">{form.phone}</p>
          {role === "ADMIN" && (
            <div className="profile-card__actions">
              <CTAbtn type="edit" onClick={() => setIsEditing(true)} />
              <CTAbtn
                type="delete"
                onClick={deleteMember}
                confirmMessage="Är du säker på att du vill ta bort medlem?"
              />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="member-modal__backdrop">
          <div className="member-modal" ref={modalRef}>
            {feedback && (
              <FeedbackMessage
                type={feedback.type}
                message={feedback.message}
                className="member-modal__feedback"
              />
            )}

            <h2
              id="edit-member-title"
              className="member-modal__title"
              tabIndex="-1"
              ref={focusRef}
            >
              Redigera medlem
            </h2>

            <div className="member-modal__edit-group">
              <label className="member-modal__label">
                Namn
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="member-modal__label">
                Styrelseroll
                <select
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

              <label className="member-modal__label">
                E-post
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </label>

              <label className="member-modal__label">
                Telefon
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </label>

              <label className="member-modal__label">
                Profilbild
                <input
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
                  alt={`Porträtt av ${form.name}`}
                  className="member-modal__image-preview"
                />
              )}
            </div>

            <div className="member-modal__controls">
              <CTAbtn type="save" onClick={saveChanges} disabled={loading} />
              <CTAbtn type="cancel" onClick={closeEdit} />
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
