"use client";

import Head from "next/head";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import FeedbackMessage from "../ui/FeedbackMessage";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDynamicNav } from "@/app/context/dynamicNav";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function DynamicPage({ slug: propSlug }) {
  const slug = propSlug === "/" ? "home" : propSlug;
  const { user } = useUser();
  const role = user?.role || "guest";
  const dynamicNav = useDynamicNav();
  const router = useRouter();

  const [content, setContent] = useState(null);
  const [pageTitle, setPageTitle] = useState("");
  const [updatedBy, setUpdatedBy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;
    if (!dynamicNav.length) return; 

    const fetchContent = async () => {
      try {
        const navEntry = dynamicNav.find((item) => item.href === `/${slug}`);

        if (navEntry?.authOnly && !user?.id) {
          router.push("/forbidden");
          return;
        }

        const res = await fetch(`/api/content/${slug}`);
        if (!res.ok) throw new Error("Misslyckades att hämta innehåll");
        const data = await res.json();

        setContent(data?.content ?? "");
        setPageTitle(data?.title ?? "");

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
      } catch (err) {
        console.error("Fel vid hämtning:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, user, dynamicNav]);

  if (!slug || typeof slug !== "string") {
    return <div className="dynamic-page">Ingen information tillgänglig</div>;
  }

  return (
    <section className="dynamic-page site-content" aria-labelledby="head-title">
      <Head>
        <title>{pageTitle || slug}</title>
        <meta
          name="description"
          content={
            content
              ? content.replace(/<[^>]+>/g, "").slice(0, 160)
              : `Information om ${slug}.`
          }
        />
      </Head>

      <div className="dynamic-page__content" aria-labelledby="head-title">
        <h1 id="head-title" className="dynamic-page__title">
          {pageTitle}
        </h1>

        {feedbackMessage && (
          <FeedbackMessage
            type={feedbackMessage.type}
            message={feedbackMessage.message}
            onClose={() => setFeedbackMessage(null)}
          />
        )}

        {loading ? (
          <div
            className="dynamic-page__loader"
            aria-busy="true"
            aria-live="polite"
          >
            <SkeletonLoader lines={7} />
          </div>
        ) : role === "ADMIN" || role === "MODERATOR" ? (
          <article className="dynamic-page__editor">
            <input
              id="head-title"
              className="dynamic-page__heading-input"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              aria-label="Sidtitel"
              placeholder="Sidtitel"
            />

            {updatedBy && (
              <div className="dynamic-page__editor__info">
                <p>
                  Senast uppdaterad av: {updatedBy.firstName}{" "}
                  {updatedBy.lastName} {updatedBy.updatedAt}
                </p>
              </div>
            )}

            <RichTextEditor
              contentId={slug}
              fallback={content}
              onContentChange={setContent}
              title={pageTitle}
              role={role}
              userId={user?.id}
              type="content"
              enableSave={true}
              onFeedback={setFeedbackMessage}
            />
          </article>
        ) : (
          <article
            className="dynamic-page__html-content prose"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
}
