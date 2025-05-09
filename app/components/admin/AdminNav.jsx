"use client";
import { useState } from "react";
import Link from "next/link";
import NavEditModal from "./NavEditModal";
import NavDeleteModal from "./NavDeleteModal";
import HeaderEditor from "./HeaderEditor";

export default function AdminNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHeaderModal, setShowHeaderModal] = useState(false);

  return (
    <div className="admin-nav">
      <button
        className="admin-nav__toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-controls="admin-dropdown"
        aria-label="Visa adminalternativ"
      >
        Adminverktyg ▾
      </button>

      {dropdownOpen && (
        <ul id="admin-dropdown" className="admin-nav__dropdown">
          <li>
            <button
              onClick={() => {
                setShowNavModal(true);
                setDropdownOpen(false);
              }}
              className="admin-nav__link"
            >
              + Lägg till ny sida
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setDropdownOpen(false);
              }}
              className="admin-nav__link"
            >
              Ta bort sida
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setShowHeaderModal(true);
                setDropdownOpen(false);
              }}
              className="admin-nav__link"
            >
              + Uppdatera header
            </button>
          </li>
          <li>
            <Link href="/admin/users" className="admin-nav__link">
              Användarhantering
            </Link>
          </li>
        </ul>
      )}

      {showNavModal && <NavEditModal onClose={() => setShowNavModal(false)} />}
      {showDeleteModal && (
        <NavDeleteModal onClose={() => setShowDeleteModal(false)} />
      )}
      {showHeaderModal && (
        <HeaderEditor onClose={() => setShowHeaderModal(false)} />
      )}
    </div>
  );
}
