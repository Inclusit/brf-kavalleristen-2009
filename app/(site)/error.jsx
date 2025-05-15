"use client";
import { useEffect } from "react";
import Head from "next/head";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Client-side error:", error);
  }, [error]);

  return (
    <section className="error-page" aria-labelledby="page-title">
      <Head>
        <title>Fel</title>
        <meta
          name="description"
          content="Ett fel har inträffat. Försök igen senare."
        />
      </Head>
      <article className="error-page__message" role="alert">
        <h1 className="error-page__title" id="page-title">
          Ojdå!
        </h1>
        <p>Det verkar som att något gick fel. Försök igen senare.</p>
      </article>
      <button className="error-page__reset-btn" onClick={() => reset()}>
        Försök igen
      </button>
    </section>
  );
}
