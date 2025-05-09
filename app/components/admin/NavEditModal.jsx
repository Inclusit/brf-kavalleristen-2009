"use client";
import { useState, useEffect } from "react";
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
          onClick={(e) => e.stopPropagation()}
        >
          <button className="nav-modal__close" onClick={onClose}>
            X
          </button>
          <h2 className="nav-modal__title">Lägg till ny sida</h2>
          <form onSubmit={handleSubmit} className="nav-modal__form">
            <label>Kategori</label>
            <select
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
            <label>Sidtitel</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel"
              required
            />
            <p className="modal__slug">
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
