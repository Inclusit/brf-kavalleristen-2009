//app/components/layout/DynamicPage.jsx
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

export default function DynamicPage({ slug }) {
  const { user } = useUser();
  const role = user?.role || "guest";
  const [content, setContent] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content/${slug}`);
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
  }, [slug]);

  return (
    <div className="dynamic-page">
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
            <RichTextEditor
              contentId={slug}
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
