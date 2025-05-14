"use client";
import { useRef, useState, useEffect } from "react";
import FeedbackMessage from "../ui/FeedbackMessage";
import CTAbtn from "../ui/CTAbtn";
import { useUser } from "@/app/context/user";

export default function UploadHandler({ onUpload }) {
  const fileInputRef = useRef(null);
  const focusRef = useRef(null);
  const { user } = useUser();
  const role = user?.role || "guest";

  const [uploadedFile, setUploadedFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    if (showModal) {
      focusRef.current?.focus();
    }
  }, [showModal]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];

    if (!file) {
      setFeedbackMessage({ type: "error", message: "Ingen fil vald." });

      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Fel vid uppladdning.");

      const data = await response.json();

      setUploadedFile({
        url: data.url,
        type: file.type,
      });

      setAltText("");
      setLinkText("");
      setShowModal(true);
    } catch (error) {
      setFeedbackMessage({
        type: "error",
        message: "Misslyckades med uppladdning.",
      });
    }
  };

  const handleConfirm = () => {
    if (uploadedFile.type.startsWith("image/") && !altText.trim()) {
      setFeedbackMessage({
        type: "error",
        message: "Alt-text krävs för bilder.",
      });

      return;
    }

    if (!uploadedFile.type.startsWith("image/") && !linkText.trim()) {
      setFeedbackMessage({
        type: "error",
        message: "Länktext krävs för filer.",
      });
      return;
    }

    const html = uploadedFile.type.startsWith("image/")
      ? `<img src="${uploadedFile.url}" alt="${altText}" />`
      : `<a href="${uploadedFile.url}" target="_blank">${linkText}</a>`;

    onUpload(html);
    setFeedbackMessage({ type: "success", message: "Filen infogades." });
    setUploadedFile(null);
    setShowModal(false);
  };

  return (
    <div className="upload-handler">
      <input
        id="file-upload"
        className="upload-handler__input"
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        ref={fileInputRef}
        onChange={handleUpload}
      />

      <div className="upload-handler__cta">
        <button
          type="button"
          className="cta-btn cta-btn--post"
          aria-label="Välj fil att ladda upp"
          onClick={triggerFileSelect}
        >
          📎 Välj fil
        </button>
      </div>

      {feedbackMessage && (
        <FeedbackMessage
          type={feedbackMessage.type}
          message={feedbackMessage.message}
          onClose={() => setFeedbackMessage(null)}
        />
      )}

      {showModal && uploadedFile && (
        <div
          className="upload-handler__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="upload-handler__modal-content">
            <h2 id="modal-title">Lägg till beskrivning</h2>

            {uploadedFile.type.startsWith("image/") ? (
              <>
                <label htmlFor="alt-text">Alt-text (bildbeskrivning):</label>
                <input
                  id="alt-text"
                  type="text"
                  ref={focusRef}
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                />
              </>
            ) : (
              <>
                <label htmlFor="link-text">Länktext:</label>
                <input
                  id="link-text"
                  type="text"
                  ref={focusRef}
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                />
              </>
            )}

            <div className="upload-handler__modal-buttons">
              <button onClick={handleConfirm}>Infoga</button>
              <button onClick={() => setShowModal(false)}>Avbryt</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
