"use client";
import { useRef } from "react";
import CTAbtn from "../ui/CTAbtn";

export default function UploadHandler({ onUpload }) {
  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Filuppladdning misslyckades");
      }

      const data = await response.json();
      onUpload(data.html); // HTML som <img> eller <a>
    } catch (error) {
      console.error("Fel vid filuppladdning:", error.message); // ← rätt!
    }
  };

  return (
    <div className="upload-handler">
      <input
        className="upload-handler__input"
        type="file"
        accept=".pdf, .doc, .docx, image/*"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <button
        className="upload-handler__button"
        type="button" 
      onClick={handleUpload}>Ladda upp fil</button>
    </div>
  );
}
