"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDynamicNav } from "@/app/context/dynamicNav";

export default function NavDeleteModal({ onClose }) {
  const navItems = useDynamicNav();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (href) => {
    if (!confirm("Är du säker på att du vill ta bort denna sida?")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/nav", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ href }),
      });

      if (!res.ok) {
        throw new Error("Något gick fel när sidan skulle tas bort.");
      }
      const data = await res.json();
      alert("Sidan har tagits bort.");
      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Något gick fel. Försök igen senare.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nav-modal">
      <div className="nav-modal__backdrop" onClick={onClose}>
        <div
          className="nav-modal__content"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="nav-modal__title">Ta bort dynamisk sida</h2>
          <ul className="nav-modal__list">
            {navItems.map((item) => (
              <li key={item.href} className="nav-modal__list-item">
                <span>{item.label}</span>
                <button
                  onClick={() => handleDelete(item.href)}
                  disabled={loading === item.href}
                  className="nav-modal__delete-button"
                >
                  {loading === item.href ? "Tar bort..." : "Ta bort sida"}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={onClose} className="nav-modal__cancel">
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}
