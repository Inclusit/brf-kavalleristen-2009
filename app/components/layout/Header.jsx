"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <div className="header__logo">
        <Image src="/images/logo.png" alt="Logo" width={100} height={50} />
      </div>
      <div className="header__text">
        <h1 className="header__title">Välkommen till vår hemsida</h1>
        <p className="header__subtitle">
          Din källa för information och inspiration
        </p>
      </div>
    </header>
  );
}
