"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";
import FeedbackMessage from "../ui/FeedbackMessage";
import { useHeaderRefresh } from "@/app/context/headerRefres";

export default function HeaderEditor({ onClose }) {
  const [headerImage, setHeaderImage] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerSub, setHeaderSub] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const router = useRouter();
  const { user } = useUser(); 
  const role = user?.role; 
  const fileRef = useRef(null);
  const focusRef = useRef();
  const modalRef = useRef();
  const { bump } = useHeaderRefresh();

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
    const fetchHeader = async () => {
      try {
        const response = await fetch("/api/content/header");
        if (!response.ok) throw new Error("Misslyckades att hämta header");
        const data = await response.json();
        console.log("Felmeddelande:", data);

        setHeaderImage(data?.image);
        setHeaderTitle(data?.title);
        setHeaderSub(data?.subtitle);
      } catch (error) {
        console.error("Error fetching header:", error);
        console.log("Felmeddelande:", data);
      }
    };

    fetchHeader();
  }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) {
      setFeedbackMessage({
        type: "error",
        message: "Ingen fil vald.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload?type=header", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedbackMessage({
          type: "error",
          message: data.message || "Misslyckad uppladdning.",
        });
        return;
      }

      setHeaderImage(`${data.url}?t=${Date.now()}`);
      setFeedbackMessage({
        type: "success",
        message: "Bild uppladdad!",
      });
    } catch (error) {
      console.error("Fel vid filuppladdning:", error);
      setFeedbackMessage({
        type: "error",
        message: "Tekniskt fel vid uppladdning.",
      });
    }
  };

  const saveHeaderUpdate = async () => {
    const response = await fetch("/api/content/header", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        role,
      },
      body: JSON.stringify({
        image: headerImage,
        title: headerTitle,
        subtitle: headerSub,
      }),
    });

    if (!response.ok) {
      setFeedbackMessage({
        type: "error",
        message: "Något gick fel vid sparande av header.",
      });
      return;
    }

    bump();

    setFeedbackMessage({
      type: "success",
      message: "Header sparad!",
    });
    router.refresh();

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (role !== "ADMIN") return null;

  return (
    <div className="nav-modal">
      <div className="nav-modal__backdrop" onClick={onClose}>
        <div
          className="nav-modal__content"
          role="dialog"
          aria-modal="true"
          aria-labelledby="header-editor-title"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="nav-modal__close"
            aria-label="Stäng modal"
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
            id="header-editor-title"
            className="nav-modal__title"
            tabIndex="-1"
            ref={focusRef}
          >
            Redigera Header
          </h2>

          <div className="header-editor">
            {headerImage && (
              <div
                className="header-editor__preview"
                style={{
                  backgroundImage: `url(${headerImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="header-editor__preview-content">
                  <div className="header__logo">
                    <img
                      src="/images/logo-placeholder.jpg"
                      alt="Föreningens logotyp"
                    />
                  </div>
                  <div className="header__text">
                    <h1 className="header__text-title">
                      {headerTitle || "Header Title"}
                    </h1>
                    <p className="header__text-subtitle">
                      {headerSub || "Header Subtitle"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="header-editor__edit-group">
              <label htmlFor="header-image" className="header-editor__label">
                Ladda upp headerbild
              </label>
              <input
                id="header-image"
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleUpload}
              />

              <label htmlFor="header-title" className="header-editor__label">
                Header Titel
              </label>
              <input
                id="header-title"
                type="text"
                value={headerTitle}
                onChange={(e) => setHeaderTitle(e.target.value)}
                placeholder="Header Title"
              />

              <label htmlFor="header-subtitle" className="header-editor__label">
                Header Subtitle
              </label>
              <input
                id="header-subtitle"
                type="text"
                value={headerSub}
                onChange={(e) => setHeaderSub(e.target.value)}
                placeholder="Header Subtitle"
              />
            </div>

            <button onClick={saveHeaderUpdate}>Spara header</button>
            <button onClick={onClose} className="nav-modal__cancel">
              Avbryt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
