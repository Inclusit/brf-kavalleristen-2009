"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { navData } from "../data/navData";
import { useDynamicNav } from "@/app/context/dynamicNav";
import FeedbackMessage from "../ui/FeedbackMessage";

export default function NavEditModal({ onClose }) {
  const [pageTitle, setPageTitle] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [authOnly, setAuthOnly] = useState(false);
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const dynamicNav = useDynamicNav();
  const router = useRouter();
  const focusRef = useRef();
  const modalRef = useRef();

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

  useEffect(() => {
    const generatedSlug = label
      .toLowerCase()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const category = selectedCat === "__new" ? newCategory.trim() : selectedCat;

    const prefix = category?.toLowerCase().includes("boende")
      ? "/for-boende"
      : category?.toLowerCase().includes("miljö")
      ? "/miljo"
      : category?.toLowerCase().includes("kontakt")
      ? "/kontakt"
      : category?.toLowerCase().includes("förening")
      ? "/foreningsinformation"
      : "";

    setSlug(`${prefix}/${generatedSlug}`);
  }, [label, selectedCat, newCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = selectedCat === "__new" ? newCategory : selectedCat;

    if (!category || !label || !slug) return;
    setLoading(true);

    if (!category || !label.trim() || !slug.trim()) {
      setFeedbackMessage({
        type: "error",
        message: "Kategori, sidnamn och slug är obligatoriska fält.",
      });
      return;
    }

    try {
      const res = await fetch("/api/nav", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          label: label,
          pageTitle: pageTitle,
          authOnly: authOnly,
          href: slug.startsWith("/") ? slug : `/${slug}`,
        }),
      });

      console.log("Skickar till API:", {
        category,
        label,
        pageTitle,
        authOnly,
        href: slug.startsWith("/") ? slug : `/${slug}`,
      });

      if (!res.ok) throw new Error("Fel vid sparande av navigering");
      setFeedbackMessage({
        type: "success",
        message: "Navigering skapad!",
      });
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 2000);
    } catch (error) {
      console.error(error);
      setFeedbackMessage({
        type: "error",
        message: "Något gick fel. Försök igen senare.",
      });
    } finally {
      setLoading(false);
    }
  };

  const allCategories = [
    ...new Set([
      ...navData.map((item) => item.label),
      ...dynamicNav.map((item) => item.category),
    ]),
  ];

  return (
    <div className="nav-modal">
      <div className="nav-modal__backdrop" onClick={onClose}>
        <div
          className="nav-modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="nav-modal-title"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            aria-label="Stäng modal"
            className="nav-modal__close"
            onClick={onClose}
          >
            X
          </button>
          {feedbackMessage && (
            <FeedbackMessage
              type={feedbackMessage.type}
              message={feedbackMessage.message}
              className="nav-modal__feedback-message"
            />
          )}
          <h2
            id="nav-modal-title"
            className="nav-modal__title"
            ref={focusRef}
            tabIndex="-1"
          >
            Lägg till ny sida
          </h2>
          <form onSubmit={handleSubmit} className="nav-modal__form">
            <label htmlFor="nav-category">Kategori</label>
            <select
              id="nav-category"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              required
            >
              <option value="">-- Välj kategori --</option>
              {allCategories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__new">+ Skapa ny kategori</option>
            </select>

            {selectedCat === "__new" && (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Ny kategori"
                required
              />
            )}

            <label htmlFor="nav-title">
              Sidtitel (kommer synas högst upp på sidan)
            </label>
            <input
              id="nav-title"
              type="text"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              placeholder="Tex. Goda grannars guide"
              required
            />

            <label htmlFor="nav-label">
              Sidans namn (vad som kommer synas i navigationen)
            </label>
            <input
              id="nav-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Sidnamn"
              required
            />

            <label htmlFor="auth-only">
              <input
                id="auth-only"
                type="checkbox"
                checked={authOnly}
                onChange={() => setAuthOnly(!authOnly)}
                
              />
              Endast synlig för medlemmar
            </label>

            <p className="modal__slug" aria-live="polite">
              Slug: <code>{slug}</code>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="nav-modal__submit"
            >
              {loading ? "Sparar..." : "Skapa ny sida"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="nav-modal__cancel"
            >
              Avbryt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
