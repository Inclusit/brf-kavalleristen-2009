"use client";
import { useState } from "react";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";
import CTAbtn from "@/app/components/ui/CTAbtn";
import FeedbackMessage from "@/app/components/ui/FeedbackMessage";
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
  const [feedbackMessage, setFeedbackMessage] = useState(null);

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
      setFeedbackMessage({
        type: "error",
        message: "Titel och innehåll är obligatoriska fält.",
      });
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
      setFeedbackMessage({
        type: "error",
        message: "Något gick fel vid skapande av nyhet.",
      });
    }
  };

  if (role !== "ADMIN" && role !== "MODERATOR") {
    return <p>Du har inte behörighet att skapa nyheter.</p>;
  }

  return (
    <section
      className="skapa-nyhet site-content"
      aria-labelledby="skapa-nyhet-title"
    >
      <h1 id="skapa-nyhet-title">Skapa nyhet</h1>

      {feedbackMessage && (
        <FeedbackMessage
          type={feedbackMessage.type}
          message={feedbackMessage.message}
          className="skapa-nyhet__feedback-message"
        />
      )}

      <div className="skapa-nyhet__title-wrapper">
        <label
          className="skapa-nyhet__title-label"
          htmlFor="news-title-input"
          id="news-title-label"
        >
          Nyhetstitel
        </label>
        <input
          id="news-title-input"
          type="text"
          className="skapa-nyhet__title-input"
          aria-labelledby="news-title-label"
          value={title}
          placeholder="Ange nyhetstitel"
          onChange={(e) => {
            setTitle(e.target.value);
            setSlug(generateSlug(e.target.value));
          }}
        />
      </div>
      <label htmlFor="news-content-input">Nyhetsinnehåll</label>
      <RichTextEditor
        contentId={slug || "nyhet"}
        fallback=""
        role={role}
        onContentChange={setContent}
        type="news"
        title={title}
        userId={userId}
        enableSave={false}
        onFeedback={setFeedbackMessage}
      />

      <div className="skapa-nyhet__actions" aria-label="Åtgärder">
        <CTAbtn
          type="post"
          role={role}
          ariaLabel={"Skapa nyhet"}
          onClick={handleCreate}
        />
        <CTAbtn
          type="cancel"
          role={role}
          ariaLabel={"Avbryt skapande av nyhet"}
          onClick={() => router.back()}
        />
      </div>
    </section>
  );
}
