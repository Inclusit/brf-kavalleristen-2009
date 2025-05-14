"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDynamicNav } from "@/app/context/dynamicNav";
import FeedbackMessage from "../ui/FeedbackMessage";

export default function NavDeleteModal({ onClose }) {
  const navItems = useDynamicNav();
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
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
      setFeedbackMessage({ type: "success", message: "Sidan har tagits bort." });
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 1500);
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

  return (
    <div className="nav-modal">
      <div className="nav-modal__backdrop" onClick={onClose}>
        <div
          className="nav-modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
        >
          {feedbackMessage && (
            <FeedbackMessage
              type={feedbackMessage.type}
              message={feedbackMessage.message}
              className="nav-modal__feedback-message"
            />
          )}
          <h2
            id="delete-modal-title"
            className="nav-modal__title"
            tabIndex="-1"
            ref={focusRef}
          >
            Ta bort dynamisk sida
          </h2>
          <ul className="nav-modal__list" role="list">
            {navItems.map((item) => (
              <li key={item.href} className="nav-modal__list-item" role="listitem">
                <span>{item.label}</span>
                <button
                  aria-label={`Ta bort sidan ${item.label}`}
                  onClick={() => handleDelete(item.href)}
                  disabled={loading === item.href}
                  className="nav-modal__delete-button"
                >
                  {loading === item.href ? "Tar bort..." : "Ta bort sida"}
                </button>
              </li>
            ))}
          </ul>
          <button
            aria-label="Stäng modal"
            type="button"
            onClick={onClose}
            className="nav-modal__cancel"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
}
