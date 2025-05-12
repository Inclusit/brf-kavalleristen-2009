"use client";

import Head from "next/head";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import { useUser } from "@/app/context/user";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function DynamicPage({ slug: propSlug }) {
  const slug = propSlug === "/" ? "home" : propSlug; 
  const { user } = useUser();
  const role = user?.role || "guest";
  const [content, setContent] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(null);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/${slug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.content !== undefined) {
          setContent(data.content);
        }
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
        console.error("Kunde inte hämta content:", err);
      }
    };
    fetchContent();
  }, [slug]);

  if (!slug || typeof slug !== "string") {
    return <div className="dynamic-page">Ingen information tillgänglig</div>;
  }

  return (
    <div className="dynamic-page site-content">
      <Head>
        <title>{slug}</title>
        <meta
          name="description"
          content={
            content
              ? content.replace(/<[^>]+>/g, "").slice(0, 160)
              : `Information om ${slug}.`
          }
        />
      </Head>

      <div className="dynamic-page__content">
        {content === null ? (
          <div className="dynamic-page__loader">
            <SkeletonLoader lines={7} />
          </div>
        ) : role === "MODERATOR" || role === "ADMIN" ? (
          
          <div className="dynamic-page__editor">
            {updatedBy && (
              <div className="dynamic-page__editor__info">
                <p>
                  Senast uppdaterad av: {updatedBy.firstName}{" "}
                  {updatedBy.lastName} {""} {updatedBy.updatedAt}
                </p>
              </div>
              
            )}

            <RichTextEditor
              contentId={slug} 
              fallback={content ?? ""}
              onContentChange={setContent}
              role={role}
              userId={user?.id}
            />
          </div>
        ) : (
          <div
            className="dynamic-page__html-content prose"
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
          />
        )}
      </div>
    </div>
  );
}
