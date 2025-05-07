"use client";
import Head from "next/head";
import { useUser } from "@/app/context/user";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function TvattstugaPage() {
  const { user } = useUser();
  const role = user?.role || "guest";
  const slug = "tvattstuga";
  const fallbackContent = "Information om tvättstuga.";

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Tvättstuga</title>
        <meta name="description" content="Information om tvättstuga." />
      </Head>
      <h1 className="text-2xl font-bold mb-4">Tvättstuga</h1>
      
      {role === "MODERATOR" || role === "ADMIN" ? (
        <RichTextEditor slug={slug} fallbackContent={fallbackContent} />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: fallbackContent }} className="prose" />
      )}
    </div>
  )
}