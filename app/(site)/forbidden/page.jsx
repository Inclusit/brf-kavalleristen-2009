"use client";
import { useEffect } from "react";
import Head from "next/head";

export default function ForbiddenPage() {
  useEffect(() => {
    console.warn("Obehörig åtkomstförsök");
  }, []);

  return (
    <section className="error-page" aria-labelledby="page-title">
      <Head>
        <title>403 – Åtkomst nekad</title>
        <meta name="robots" content="noindex" />
      </Head>
      <article className="error-page__message" role="alert">
        <h1 className="error-page__title" id="page-title">
          Åtkomst nekad
        </h1>
        <p>Du har inte behörighet att visa den här sidan.</p>
      </article>
      <a href="/" className="error-page__reset-btn">
        Gå till startsidan
      </a>
    </section>
  );
}
