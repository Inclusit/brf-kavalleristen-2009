"use client";

import {  useRef, useState } from "react";
import Link from "next/link";
import { navData } from "../data/navData";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);

  const toggleDropdown = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };
  

  return (
    <div className="navbar">
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

              {item.children && (
                <ul
                  ref={(el) => (dropdownRefs.current[index] = el)}
                  className={`navbar__dropdown ${
                    isOpen === index ? "navbar__dropdown--open" : ""
                  }`}
                  style={{
                    maxHeight:
                      isOpen === index
                        ? `${dropdownRefs.current[index]?.scrollHeight}px`
                        : "0px",
                  }}
                >
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex} className="navbar__dropdown-item">
                      {subItem.external ? (
                        <a
                          href={subItem.href}
                          className="navbar__dropdown-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                        >
                          {subItem.label} ↗
                        </a>
                      ) : (
                        <Link
                          href={subItem.href}
                          className="navbar__dropdown-link"
                          role="menuitem"
                        >
                          {subItem.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
