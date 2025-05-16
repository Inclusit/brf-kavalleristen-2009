"use client";
import { useEffect, useState } from "react";
import { useHeaderRefresh } from "@/app/context/headerRefres";

export default function Header() {
  const [header, setHeader] = useState({
    image: null,
    title: "Välkommen till vår förening",
    subtitle: "Här hittar du allt om boende, kontakt och miljö.",
  });

  const { refreshKey } = useHeaderRefresh();

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await fetch("/api/content/header");
        if (!res.ok) throw new Error("Kunde inte hämta header");
        const data = await res.json();
        
        setHeader({
          image: data?.image || null,
          title: data?.title || "Välkommen till vår förening",
          subtitle:
            data?.subtitle ||
            "Här hittar du allt om boende, kontakt och miljö.",
        });
        
      } catch (error) {
        console.error("Fel vid hämtning av header:", error);
      }
    };

    fetchHeader();
  }, [refreshKey]);

  return (
    <div
      className="header"
      style={{
        ...(header.image
          ? {
              backgroundImage: `url(${header.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}),
      }}
    >
      <div className="header__overlay" aria-hidden="true"></div>
      <div className="header__container">
        <div className="header__logo">
          <img
            src="/icons/logo.svg"
            alt="Logo"
            width={100}
            height={100}
          />
        </div>

        <div className="header__text">
          <p className="header__title">{header.title}</p>
          <p className="header__subtitle">{header.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
