
"use client";
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Role } from "@prisma/client";

export default function RichTextEditor({ contentId, fallback }) {
  const [content, setContent] = useState(fallback || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/content/${contentId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setContent(data.content || fallback);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [contentId]);

  return (
    <>
      {isEditing && (Role === "ADMIN" || Role === "MODERATOR") ? (
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={(event, editor) => setContent(editor.getData())}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </>
  );
}
