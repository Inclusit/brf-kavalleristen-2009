"use client";

import { useState } from "react";
import Link from "next/link";
import { navData } from "./data/navData";

export default function Navbar() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__logo"></div>
        <ul className="navbar__link-list">
          {navData.map((item, index) => (
            <li
              key={index}
              className={`navbar__item ${
                item.children ? "navbar__item--has-dropdown" : ""
              }`}
            >
              {item.href ? (
                <Link href={item.href} className="navbar__link">
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

              {item.children && openIndex === index && (
                <ul className="navbar__dropdown">
                  {item.children.map((subItem, subIndex) => (
                    <li key={subIndex} className="navbar__dropdown-item">
                      <Link
                        href={subItem.href}
                        className="navbar__dropdown-link"
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
