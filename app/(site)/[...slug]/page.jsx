"use client";
import DynamicPage from "@/app/components/layout/DynamicPage";
import { useParams } from "next/navigation";
import { useState } from "react";
import FeedbackMessage from "@/app/components/ui/FeedbackMessage";

export default function DynamicPageWrapper() {
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;

  if (!slug) {
    console.error("Invalid slug:", slug);
    setFeedbackMessage({
      type: "error",
      message: "Ogiltig URL. Var god försök igen.",
    });
    return <div>
      <FeedbackMessage
        type={feedbackMessage.type}
        message={feedbackMessage.message}
      />
      Ingen information tillgänglig</div>;
  }

  return <DynamicPage slug={slug} />;
}
