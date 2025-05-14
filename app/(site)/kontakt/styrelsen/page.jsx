"use client";
import CardGrid from "@/app/components/cards/CardGrid";
import Head from "next/head";

export default function StyrelsenPage() {
  return (
    <section className="styrelsen-page section-wrap" aria-labelledby="page-title">
      <Head>
        <title>Styrelsen</title>
        <meta
          name="description"
          content="Information om styrelsen i föreningen."
        />
      </Head>

      <h1 id="page-title" className="styrelsen-page__title">Styrelsen</h1>
      <p className="styrelsen-page__intro">
        Här hittar du information om styrelsen i föreningen, inklusive
        kontaktuppgifter och roller. Om du har frågor eller behöver hjälp, tveka
        inte att kontakta oss.
      </p>

      <CardGrid />
    </section>
  );
}
