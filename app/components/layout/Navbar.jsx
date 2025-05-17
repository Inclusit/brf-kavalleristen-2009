"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { navData } from "../data/navData";
import { useDynamicNav } from "@/app/context/dynamicNav";
import { useUser } from "@/app/context/user";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRefs = useRef([]);
  const navRef = useRef(null);
  const { user } = useUser();
  const isLoggedIn = !!user;

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

  const filteredDynamicNav = dynamicNav.filter(
    (item) => !item.authOnly || isLoggedIn
  );

  const groupedDynamic = filteredDynamicNav.reduce((acc, item) => {
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
          aria-controls="main-navigation"
          aria-label={mobileMenu ? "Stäng meny" : "Öppna meny"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul
          id="main-navigation"
          className={`navbar__link-list ${
            mobileMenu ? "navbar__link-list--open" : ""
          }`}
        >
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
                  aria-expanded={isOpen === index}
                  aria-controls={`dropdown-${index}`}
                  aria-label={`Öppna meny för ${item.label}`}
                >
                  {item.label}
                </button>
              )}

              {(item.children || groupedDynamic[item.label]) && (
                <ul
                  id={`dropdown-${index}`}
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
                          tabIndex={isOpen === index ? 0 : -1}
                          aria-hidden={isOpen !== index}
                        >
                          {subItem.label}
                          <img
                            src="/icons/external-link-icon.svg"
                            alt=""
                            aria-hidden="true"
                            className="navbar__external-icon"
                          />
                        </a>
                      ) : (
                        <Link
                          href={subItem.href}
                          className="navbar__dropdown-link"
                          tabIndex={isOpen === index ? 0 : -1}
                          aria-hidden={isOpen !== index}
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
                        tabIndex={isOpen === index ? 0 : -1}
                        aria-hidden={isOpen !== index}
                      >
                        {nav.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {extraCategories.map(([label, items], dynCatIndex) => (
            <li
              key={`extra-cat-${dynCatIndex}`}
              className="navbar__item navbar__item--has-dropdown"
            >
              <button
                className="navbar__link"
                onClick={() => toggleDropdown(`extra-${dynCatIndex}`)}
                aria-expanded={isOpen === `extra-${dynCatIndex}`}
                aria-controls={`extra-dropdown-${dynCatIndex}`}
                aria-label={`Öppna meny för ${label}`}
              >
                {label}
              </button>

              <ul
                id={`extra-dropdown-${dynCatIndex}`}
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
                      tabIndex={isOpen === `extra-${dynCatIndex}` ? 0 : -1}
                      aria-hidden={isOpen !== `extra-${dynCatIndex}`}
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
