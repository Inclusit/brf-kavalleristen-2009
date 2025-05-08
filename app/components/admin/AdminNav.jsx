"use client";
import { useState } from "react";
import Link from "next/link";
import NavEditModal from "../ui/NavEditModal";

export default function AdminNav() {
  const [showNavModal, setShowNavModal] = useState(false);


  return (
    <div className="admin-nav">
      <div className="admin-nav__container">
        <button
          className="admin-nav__btn"
          onClick={() => setShowNavModal(true)}
          aria-label="Lägg till ny sida"
        >
         + Lägg till ny sida
        </button>
        
        <Link
          href="/admin"
          className="admin-nav__btn"
          aria-label="Gå till admin"
        >
          Adminpanel
        </Link>

        {showNavModal && (
          <NavEditModal onClose={() => setShowNavModal(false)} />
        )}

    
      </div>
    </div>
  );
}
