"use client";
import { useParams, useRouter } from "next/navigation";
import Head from "next/head";
import { useUser } from "@/app/context/user";
import CTAbtn from "@/app/components/ui/CTAbtn";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(
  () => import("@/app/components/cms/RichTextEditor"),
  { ssr: false }
);

export default function NewsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const role = user?.role || "guest";

  if (!slug || typeof slug !== "string") {
    return <div className="news-page">Ingen information tillgänglig</div>;
  }

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Är du säker på att du vill ta bort nyheten?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/nyheter/${slug}`, {
        method: "DELETE",
        headers: {
          role,
        },
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
    <div className="news-page">
      <Head>
        <title>{slug}</title>
        <meta name="description" content={`Nyhet: ${slug}`} />
      </Head>

      <RichTextEditor contentId={slug} fallback="" role={role} />

      {role === "ADMIN" && (
        <CTAbtn type="delete" role={role} onClick={handleDelete} />
      )}
    </div>
  );
}
