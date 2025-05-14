"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import NavEditModal from "./NavEditModal";
import NavDeleteModal from "./NavDeleteModal";
import HeaderEditor from "./HeaderEditor";

export default function AdminNav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNavModal, setShowNavModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="admin-nav">
      <button
        id="admin-toggle"
        className="admin-nav__toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
        aria-controls="admin-dropdown"
        aria-label="Visa adminalternativ"
      >
        Admin
      </button>

      {dropdownOpen && (
        <ul
          id="admin-dropdown"
          className="admin-nav__dropdown"
          role="menu"
          aria-labelledby="admin-toggle"
          ref={dropdownRef}
        >
          <li role="menuitem">
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
          <li role="menuitem">
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
          <li role="menuitem">
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
          <li role="menuitem">
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
