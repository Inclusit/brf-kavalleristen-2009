"use client";
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CTAbtn from "../ui/CTAbtn";
import UploadHandler from "./UploadHandler";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function RichTextEditor({
  contentId,
  fallback,
  role,
  onContentChange,
  enableSave = true,
  type = "content",
  title,
  userId,
}) {
  const [content, setContent] = useState(fallback || "");
  const isEditing = role === "ADMIN" || role === "MODERATOR";

  useEffect(() => {
    console.log(
      "Plugins i din ClassicEditor:",
      ClassicEditor.builtinPlugins.map((p) => p.pluginName)
    );
  }, []);

  const fetchContent = async () => {
    if (!contentId || type !== "content") return;

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
    const isNews = type === "news";

    if (isNews && (!title || !userId)) {
      alert("Titel och användar-ID krävs för att spara nyhet.");
      return;
    }

    const endpoint = isNews
      ? `/api/nyheter/${contentId}`
      : `/api/content/${contentId}`;

    const body = isNews
      ? JSON.stringify({ title, content })
      : JSON.stringify({ content });

    const headers = {
      "Content-Type": "application/json",
      role,
      userId, // 🟢 alltid med nu
    };

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers,
        body,
      });
      if (!response.ok) throw new Error("Misslyckades att spara innehåll");
      alert("Innehåll sparat!");
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid sparning");
    }
  };

  useEffect(() => {
    if (!isEditing) {
      const container = document.querySelector(".richtext__content");
      if (!container) return;

      container.scrollIntoView({ behavior: "smooth" });
      const links = container.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      });
    }
  }, [isEditing, content]);

  return (
    <div>
      {isEditing ? (
        <>
          <CKEditor
            editor={ClassicEditor}
            data={content || `Information om ${contentId}`}

            onChange={(__, editor) => {
              const newData = editor.getData();
              setContent(newData);
              onContentChange?.(newData);
            }}
          />
          <UploadHandler
            onUpload={(html) =>
              setContent((prev) => prev + "<p>" + html + "</p>")
            }
          />

          {isEditing && enableSave && (
            <div>
              <CTAbtn type="save" onClick={saveContent} role={role} />
            </div>
          )}
        </>
      ) : (
        <article
          className="richtext__content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
