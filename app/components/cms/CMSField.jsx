"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ReadOnlyContent from "./ReadOnlyContent";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";

// Dynamisk import av Editor-komponenten för att undvika SSR-problem
const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default function CMSField({ initialHtml }) {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = LocalStorageKit.get("@app/token");

    if (!token) {
      setRole("GUEST");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role || "USER");
    } catch (err) {
      console.error("Kunde inte parsa token:", err);
      setRole("USER");
    }
  }, []);

  if (role === "ADMIN" || role === "MODERATOR") {
    return <Editor />;
  } else {
    return <ReadOnlyContent html={initialHtml} />;
  }
}
