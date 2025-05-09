"use client";
import { useState } from "react";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";
import CTAbtn from "@/app/components/ui/CTAbtn";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function CreateNewsPage() {
  const { user } = useUser();
  const role = user?.role;
  const userId = user?.id;
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[åä]/g, "a")
      .replace(/ö/g, "o")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleCreate = async () => {
    const finalSlug = generateSlug(title);

    await new Promise((resolve) => setTimeout(resolve, 0));

    if (!title.trim() || !content.trim()) {
      alert("Titel och innehåll måste vara ifyllda.");
      return;
    }

    try {
      const response = await fetch("/api/nyheter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          role,
          userId,
        },
        body: JSON.stringify({ title, slug: finalSlug, content }),
      });

      if (!response.ok) throw new Error("Misslyckades att skapa nyhet");
      router.push(`/for-boende/nyheter/${finalSlug}`);
    } catch (err) {
      console.error("Fel vid skapande:", err);
      alert("Något gick fel.");
    }
  };

  if (role !== "ADMIN" && role !== "MODERATOR") {
    return <p>Du har inte behörighet att skapa nyheter.</p>;
  }

  return (
    <div className="skapa-nyhet">
      <h1>Skapa nyhet</h1>

      <label htmlFor="title">Titel</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setSlug(generateSlug(e.target.value));
        }}
      />

      <label>Innehåll</label>
      <RichTextEditor
        contentId={slug || "temp-id"} 
        fallback=""
        role={role}
        onContentChange={setContent}
        type="news"
        title={title}
        userId={userId}
        enableSave={false}
      />

      <div className="skapa-nyhet__actions">
        <CTAbtn type="post" role={role} onClick={handleCreate} />
        <CTAbtn type="cancel" role={role} onClick={() => router.back()} />
      </div>
    </div>
  );
}
