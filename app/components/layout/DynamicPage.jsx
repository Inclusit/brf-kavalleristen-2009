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
  const { user } = useUser();
  const role = user?.role || "guest";
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!propSlug || typeof propSlug !== "string") return;
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/${propSlug}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data?.content !== undefined) {
          setContent(data.content);
        }
      } catch (err) {
        console.error("Kunde inte hämta content:", err);
      }
    };
    fetchContent();
  }, [propSlug]);

  if (!propSlug || typeof propSlug !== "string") {
    return <div className="dynamic-page">Ingen information tillgänglig</div>;
  }

  return (
    <div className="dynamic-page">
      <Head>
        <title>{propSlug}</title>
        <meta
          name="description"
          content={
            content
              ? content.replace(/<[^>]+>/g, "").slice(0, 160)
              : `Information om ${propSlug}.`
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
            <RichTextEditor
              contentId={propSlug}
              fallback={content ?? ""}
              onContentChange={setContent}
              role={role}
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
