"use client";

import { useState } from "react";
import Image from "next/image";
import LoginModal from "../ui/LoginModal";
import LocalStorageKit from "@/app/lib/utils/localStorageKit";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    LocalStorageKit.remove("user");
    LocalStorageKit.remove("@library/token");
    LocalStorageKit.remove("role");
    window.dispatchEvent(new Event("storage"));
    router.refresh();
  };

  return (
    <div className="footer" id="footer">
      <div className="section-wrap footer__container">
        <div className="footer__logo">
          <Image
            src={"/images/logo-placeholder.jpg"}
            alt="BRF Kavalleristen 2009"
            width={100}
            height={100}
          />
        </div>

        <div className="footer__info">
          <div className="footer__info-item">
            <p className="footer__info-text">BRF Kavalleristen 2009</p>
            <p className="footer__info-text">Org.nr: 769 620 - 6684</p>
            <a
              className="footer__info-text"
              href="mailto:info@kavalleristen2009.se"
            >
              info@kavalleristen2009.se
            </a>
          </div>
          <div className="footer__info-item">
            <p className="footer__info-text">Besöksadress</p>
            <p className="footer__info-text">Kavallerigatan 31</p>
            <p className="footer__info-text">194 75 Upplands Väsby</p>
          </div>
          <div className="footer__info-item">
            <p className="footer__info-text">Postadress</p>
            <p className="footer__info-text">Renew Service</p>
            <p className="footer__info-text">Box 2018</p>
            <p className="footer__info-text">194 02 Upplands Väsby</p>
          </div>
          <div className="footer__info-item">
            <p className="footer__info-text">Fakturaadress</p>
            <a
              className="footer__info-text"
              href="mailto:brf.kavalleristen.2009@invoice.realnode.se"
            >
              brf.kavalleristen.2009@invoice.realnode.se
            </a>
          </div>
        </div>

        <div className="footer__login">
          {user ? (
            <button className="footer__login-button" onClick={handleLogout}>
              <img
                src="/icons/logout-icon.svg"
                alt="Logga ut"
                className="footer__icon logout"
                width={30}
                height={30}
              />
              Logga ut
            </button>
          ) : (
            <div>
              <p>Boende i föreningen?</p>
              <button
                className="footer__login-button"
                onClick={() => setShowModal(true)}
                aria-haspopup="dialog"
                aria-controls="login-modal"
                aria-expanded={showModal}
              >
                <img
                  src="/icons/login-icon.svg"
                  alt="Logga in"
                  className="footer__icon login"
                  width={30}
                  height={30}
                />
                Logga in
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
