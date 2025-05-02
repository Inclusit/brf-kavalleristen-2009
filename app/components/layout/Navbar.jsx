"use client";

import { useState } from "react";
import Link from "next/link";
import { navData } from "../data/navData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);


  const toggleDropdown = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <button
          className={`navbar__mobile ${
            mobileMenu ? "navbar__mobile--open" : ""
          }`}
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-expanded={mobileMenu}
          aria-controls="mobile-menu"
          aria-label={mobileMenu ? "Stäng meny" : "Öppna meny"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul
          className={`navbar__link-list ${
            mobileMenu ? "navbar__link-list--open" : ""
          }`}
          role="navigation"
        >
          {navData.map((item, index) => (
            <li
              key={index}
              className={`navbar__item ${
                item.children ? "navbar__item--has-dropdown" : ""
              }`}
            >
              {item.href ? (
                <Link href={item.href} className="navbar__link" role="menuitem">
                  {item.label}
                </Link>
              ) : (
                <button
                  className="navbar__link"
                  onClick={() => toggleDropdown(index)}
                >
                  {item.label}
                </button>
              )}

              {item.children && isOpen === index && (
                <ul className="navbar__dropdown">
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex} className="navbar__dropdown-item">
                      <Link
                        href={subItem.href}
                        className="navbar__dropdown-link"
                        role="menuitem"
                      >
                        {subItem.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
