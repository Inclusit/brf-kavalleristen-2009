"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";

export default function HeaderEditor({ onClose }) {
  const [headerImage, setHeaderImage] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [headerSub, setHeaderSub] = useState("");
  const router = useRouter();
  const { user } = useUser(); 
  const role = user?.role; 
  const fileRef = useRef(null);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const response = await fetch("/api/content/header");
        if (!response.ok) throw new Error("Misslyckades att hämta header");
        const data = await response.json();
        setHeaderImage(data?.image);
        setHeaderTitle(data?.title);
        setHeaderSub(data?.subtitle);
      } catch (error) {
        console.error("Error fetching header:", error);
      }
    };

    fetchHeader();
  }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload?type=header", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert(
          "Misslyckad uppladdning – kontrollera att bilden är minst 1440px bred."
        );
        return;
      }

      const data = await response.json();
      setHeaderImage(data.url);
    } catch (error) {
      console.error("Fel vid filuppladdning:", error.message);
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
      alert("Något gick fel vid sparning av header");
      return;
    }

    alert("Header sparad!");
    router.refresh(); 
    if (onClose) onClose();
  };

  if (role !== "ADMIN") return null;

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
          <h2 className="nav-modal__title">Redigera Header</h2>

          <div className="header-editor">
            {headerImage && (
              <div
                className="header-editor__preview"
                style={{
                  backgroundImage: `url(${headerImage})`,
                }}
              >
                <div className="header-editor__preview-content">
                  <div className="header__logo">
                    <img src="/images/logo-placeholder.jpg" alt="Logo" />
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

            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleUpload}
            />

            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="Header Title"
            />

            <input
              type="text"
              value={headerSub}
              onChange={(e) => setHeaderSub(e.target.value)}
              placeholder="Header Subtitle"
            />

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
