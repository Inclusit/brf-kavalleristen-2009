"use client";
import DynamicPage from "@/app/components/layout/DynamicPage";
import { useParams } from "next/navigation";

export default function DynamicPageWrapper() {
    const { slug } = useParams();
    
    if (!slug || typeof slug !== "string") {
        console.error("Invalid slug:", slug);

        return <div>Ingen information tillgänglig</div>;
    }

    return <DynamicPage slug={slug} />;
    }