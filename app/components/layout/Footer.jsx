"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "../LoginModal";
export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  return (
    <footer className="footer">
      <div className="section-wrap footer__inner">
        <div className="footer__logo">
          <Image src={"/images/logo-placeholder.jpg"} alt="Logo" width={100} height={100} />
        </div>

        <div className="footer__info">
          <p>Brf Solsidan</p>
          <p>Solgatan 12, 123 45 Solstad</p>
          <p>
            <a href="mailto:kontakt@brfsolsidan.se">kontakt@brfsolsidan.se</a>
          </p>
        </div>

        <div className="footer__login">
          <button
            className="footer__login-button"
            onClick={() => setShowModal(true)}
          >
            Logga in
          </button>
        </div>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </footer>
  );
}
