"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { navData } from "../data/navData";
import { useDynamicNav } from "@/app/context/dynamicNav";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);
  const navRef = useRef(null);

  const dynamicNav = useDynamicNav();

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (index) => {
    setIsOpen(isOpen === index ? null : index);
  };

  const groupedDynamic = dynamicNav.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const allLabels = new Set(navData.map((item) => item.label));
  const extraCategories = Object.entries(groupedDynamic).filter(
    ([label]) => !allLabels.has(label)
  );

  return (
    <div className="navbar" ref={navRef}>
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

              {(item.children || groupedDynamic[item.label]) && (
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
                  {item.children?.map((subItem, subIndex) => (
                    <li
                      key={`static-${subIndex}`}
                      className="navbar__dropdown-item"
                    >
                      {subItem.external ? (
                        <a
                          href={subItem.href}
                          className="navbar__dropdown-link"
                          target="_blank"
                          rel="noopener noreferrer"
                          role="menuitem"
                        >
                          {subItem.label}
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

                  {groupedDynamic[item.label]?.map((nav, dynIndex) => (
                    <li
                      key={`dynamic-${dynIndex}`}
                      className="navbar__dropdown-item"
                    >
                      <Link
                        href={nav.href}
                        className="navbar__dropdown-link"
                        role="menuitem"
                      >
                        {nav.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {/* 🔵 Extra dynamiska kategorier som inte finns i navData */}
          {extraCategories.map(([label, items], dynCatIndex) => (
            <li
              key={`extra-cat-${dynCatIndex}`}
              className="navbar__item navbar__item--has-dropdown"
            >
              <button
                className="navbar__link"
                onClick={() => toggleDropdown(`extra-${dynCatIndex}`)}
              >
                {label}
              </button>
              <ul
                ref={(el) =>
                  (dropdownRefs.current[`extra-${dynCatIndex}`] = el)
                }
                className={`navbar__dropdown ${
                  isOpen === `extra-${dynCatIndex}`
                    ? "navbar__dropdown--open"
                    : ""
                }`}
                style={{
                  maxHeight:
                    isOpen === `extra-${dynCatIndex}`
                      ? `${
                          dropdownRefs.current[`extra-${dynCatIndex}`]
                            ?.scrollHeight
                        }px`
                      : "0px",
                }}
              >
                {items.map((nav, subIndex) => (
                  <li
                    key={`extra-link-${subIndex}`}
                    className="navbar__dropdown-item"
                  >
                    <Link
                      href={nav.href}
                      className="navbar__dropdown-link"
                      role="menuitem"
                    >
                      {nav.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
