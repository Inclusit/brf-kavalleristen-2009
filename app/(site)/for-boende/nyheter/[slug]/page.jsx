"use client";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { useUser } from "@/app/context/user";
import CTAbtn from "@/app/components/ui/CTAbtn";
import FeedbackMessage from "@/app/components/ui/FeedbackMessage";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function NewsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const role = user?.role || "guest";

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedBy, setUpdatedBy] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/nyheter/${slug}`);
        if (!res.ok) throw new Error("Misslyckades att hämta nyheten");
        const data = await res.json();
        setTitle(data.title || "");
        setContent(data.content || "");
        setCreatedAt(
          new Date(data.createdAt).toLocaleDateString("sv-SE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        );

        if (data.updatedBy) {
          setUpdatedBy({
            firstName: data.updatedBy.firstName,
            lastName: data.updatedBy.lastName,
            updatedAt: new Date(data.updatedAt).toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          });
        }

        if (data.author) setAuthor(data.author);

        setLoading(false); 
      } catch (err) {
        console.error("Fel vid hämtning:", err);
        setLoading(false);
      }
    };

    if (slug) fetchNews();
  }, [slug]);


  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Är du säker på att du vill ta bort nyheten?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/nyheter/${slug}`, {
        method: "DELETE",
        headers: { role },
      });
      if (!response.ok) throw new Error("Något gick fel vid borttagning.");     
      setFeedback({ type: "success", message: "Nyheten har tagits bort." });
      router.push("/nyheter");
    } catch (error) {
      console.error("Error deleting news:", error);
      setFeedback({
        type: "error",
        message: "Något gick fel vid borttagning av nyhet.",
      });
    }
  };

  return (
    <section className="news-page site-content" aria-labelledby="news-title">
      <Head>
        <title>{title || slug}</title>
        <meta name="description" content={`Nyhet: ${slug}`} />
      </Head>

      {feedbackMessage && (
        <FeedbackMessage
          type={feedbackMessage.type}
          message={feedbackMessage.message}
          className="news-page__feedback-message"
        />
      )}

      {loading ? (
        <div aria-busy={loading} aria-live="polite">
          <SkeletonLoader count={7} />;
        </div>
      ) : (
        <>
          {role === "ADMIN" || role === "MODERATOR" ? (
            <div>
              <div className="news-page__title-wrapper">
                <label
                  htmlFor="news-title-input"
                  id="news-title-label"
                  className="news-page__title-label"
                >
                  Uppdatera nyhetstitel
                </label>
                <input
                  id="news-title-input"
                  className="news-page__title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-labelledby="news-title-label"
                  placeholder="Ange nyhetstitel"
                />
              </div>
            </div>
          ) : (
            <h1 id="news-title">{title}</h1>
          )}

          <div className="news-page__update-information">
            {updatedBy && (
              <p className="news-page__updated-by">
                Senast uppdaterad av: {updatedBy.firstName} {updatedBy.lastName}{" "}
                {updatedBy.updatedAt}
              </p>
            )}

            {author && (
              <p className="news-page__author">
                Skriven av: {author.firstName} {author.lastName} {author.createdAt}
              </p>
            )}
          </div>

          <label htmlFor="news-content">Uppdatera nyhetsinnehåll</label>
          <RichTextEditor
            contentId={slug}
            fallback={content}
            role={role}
            onContentChange={setContent}
            type="news"
            title={title}
            userId={user?.id}
            onFeedback={setFeedbackMessage}
          />

          {(role === "ADMIN" || role === "MODERATOR") && (
            <div className="news-page__actions">
              <CTAbtn
                type="delete"
                role={role}
                onClick={handleDelete}
                ariaLabel={"Ta bort nyhet"}
                confirmMessage={"Är du säker på att du vill ta bort nyheten?"}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
