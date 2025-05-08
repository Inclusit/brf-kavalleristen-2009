"use client";
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CTAbtn from "../ui/CTAbtn";
import UploadHandler from "./UploadHandler";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Role } from "@prisma/client";

export default function RichTextEditor({ contentId, fallback, role }) {

  const [content, setContent] = useState(fallback || "");
  const [isEditing, setIsEditing] = useState(
    role === "ADMIN" || role === "MODERATOR"
  );

  const fetchContent = async () => {
    if (!contentId) {
      console.error("Innehålls-ID saknas");
      return null;
    }

    if (content) return; 

    try {
      const response = await fetch(`/api/content/${contentId}`);
      if (!response.ok) throw new Error("Misslyckades att hämta innehåll");
      const data = await response.json();
      setContent(data?.content ?? fallback ?? "");
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };


  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const saveContent = async () => {
    try {
      const response = await fetch(`/api/content/${contentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error("Misslyckades att spara innehåll");
      alert("Sparat!");
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid sparning");
    }
  };

  useEffect(() => {
    if (!isEditing) {
      const container = document.querySelector(".richtext__content");
      
      if (!container) return;

      if (container) {
        container.scrollIntoView({ behavior: "smooth" });
      }

      const links = container.querySelectorAll("a");

      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
}
  }, [isEditing, content]);

  return (
    <>
      {isEditing ? (
        <>
          <CKEditor
            editor={ClassicEditor}
            data={content || `Information om ${contentId}`}
            onChange={(__, editor) => setContent(editor.getData())}
          />
          <UploadHandler
            onUpload={(html) => {
              setContent((prev) => prev + "<p>" + html + "</p>");
            }}
          />

          <div>
            <CTAbtn type="save" onClick={saveContent} role={role} />
          </div>
        </>
      ) : (
        <div className="richtext__content" dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </>
  );
}
