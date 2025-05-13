"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { navData } from "../data/navData";
import { useDynamicNav } from "@/app/context/dynamicNav";

export default function NavEditModal({ onClose }) {
  const [selectedCat, setSelectedCat] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
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
    const generatedSlug = title
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
  }, [title, selectedCat, newCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = selectedCat === "__new" ? newCategory : selectedCat;

    if (!category || !title || !slug) return;
    setLoading(true);

    if (!category || !title.trim() || !slug.trim()) {
      alert("Alla fält måste vara ifyllda.");
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
          label: title,
          href: slug.startsWith("/") ? slug : `/${slug}`,
        }),
      });

      console.log("Sending nav entry:", {
        category,
        label: title,
        href: slug.startsWith("/") ? slug : `/${slug}`,
      });

      if (!res.ok) throw new Error("Fel vid sparande av navigering");
      alert("Sidan har sparats!");
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Något gick fel vid sparning av navigering");
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
          <button aria-label="Stäng modal" className="nav-modal__close" onClick={onClose}>
            X
          </button>
          <h2 id="nav-modal-title" className="nav-modal__title" 
          ref={focusRef} tabIndex="-1">
          Lägg till ny sida</h2>
          <form onSubmit={handleSubmit} className="nav-modal__form">
            <label htmlFor="nav-category" >Kategori</label>
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
            <label htmlFor="nav-title">Sidtitel</label>
            <input
              id="nav-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              required
            />
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
