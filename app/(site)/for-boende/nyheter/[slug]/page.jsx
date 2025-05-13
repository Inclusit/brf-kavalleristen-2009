"use client";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { useUser } from "@/app/context/user";
import CTAbtn from "@/app/components/ui/CTAbtn";
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
  const [updatedBy, setUpdatedBy] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 ny state

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/nyheter/${slug}`);
        if (!res.ok) throw new Error("Misslyckades att hämta nyheten");
        const data = await res.json();
        setTitle(data.title || "");
        setContent(data.content || "");

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

        setLoading(false); // 👈 färdigladdat
      } catch (err) {
        console.error("Fel vid hämtning:", err);
        setLoading(false);
      }
    };

    if (slug) fetchNews();
  }, [slug]);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/nyheter/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          role,
          userId: user?.id,
        },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error("Misslyckades att spara");
      alert("Nyheten har sparats!");
    } catch (err) {
      console.error(err);
      alert("Något gick fel vid sparande.");
    }
  };

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
      alert("Nyheten har tagits bort.");
      router.push("/nyheter");
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Något gick fel vid borttagning.");
    }
  };

  return (
    <section className="news-page site-content" aria-labelledby="news-title">
      <Head>
        <title>{title || slug}</title>
        <meta name="description" content={`Nyhet: ${slug}`} />
      </Head>

      {loading ? (
        <div aria-busy={loading} aria-live="polite">
          <SkeletonLoader count={7} />;
        </div>
      ) : (
        <>
          {role === "ADMIN" || role === "MODERATOR" ? (
            <div>
              <div className="news-page__title-wrapper">
              <label htmlFor="news-title-input">Uppdatera nyhetstitel</label>
              <input
                id="news-title-input"
                className="news-page__title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              </div>
            </div>
          ) : (
            <h1 id="news-title">{title}</h1>
          )}

          <label htmlFor="news-content">Uppdatera nyhetsinnehåll</label>
          <RichTextEditor
            contentId={slug}
            fallback={content}
            role={role}
            onContentChange={setContent}
            type="news"
            title={title}
            userId={user?.id}
          />

          {updatedBy && (
            <p className="news-page__updated-by">
              Senast uppdaterad av: {updatedBy.firstName} {updatedBy.lastName}{" "}
              {updatedBy.updatedAt}
            </p>
          )}

          {author && (
            <p className="news-page__author">
              Skriven av: {author.firstName} {author.lastName}
            </p>
          )}

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
