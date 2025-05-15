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
    const newIndex = String(index);
    setIsOpen(isOpen === newIndex ? null : newIndex);
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
          {navData.map((item, index) => {
            const strIndex = String(index);
            return (
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
                    aria-expanded={isOpen === strIndex}
                    aria-controls={`dropdown-${index}`}
                    aria-label={`Öppna meny för ${item.label}`}
                    role="button"
                  >
                    {item.label}
                  </button>
                )}

                {(item.children || groupedDynamic[item.label]) && (
                  <ul
                    id={`dropdown-${index}`}
                    ref={(el) => (dropdownRefs.current[index] = el)}
                    className={`navbar__dropdown ${
                      isOpen === strIndex ? "navbar__dropdown--open" : ""
                    }`}
                    style={{
                      maxHeight:
                        isOpen === strIndex
                          ? `${dropdownRefs.current[index]?.scrollHeight}px`
                          : "0px",
                    }}
                    aria-hidden={isOpen !== strIndex}
                    role="menu"
                  >
                    {isOpen === strIndex && (
                      <>
                        {item.children?.map((subItem, subIndex) => (
                          <li
                            key={`static-${subIndex}`}
                            className="navbar__dropdown-item"
                            role="none"
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
                            role="none"
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
                      </>
                    )}
                  </ul>
                )}
              </li>
            );
          })}

          {extraCategories.map(([label, items], dynCatIndex) => {
            const extraKey = `extra-${dynCatIndex}`;
            return (
              <li
                key={extraKey}
                className="navbar__item navbar__item--has-dropdown"
              >
                <button
                  className="navbar__link"
                  onClick={() => toggleDropdown(extraKey)}
                  aria-expanded={isOpen === extraKey}
                  aria-controls={`extra-dropdown-${dynCatIndex}`}
                  aria-label={`Öppna meny för ${label}`}
                  role="button"
                >
                  {label}
                </button>
                <ul
                  id={`extra-dropdown-${dynCatIndex}`}
                  ref={(el) => (dropdownRefs.current[extraKey] = el)}
                  className={`navbar__dropdown ${
                    isOpen === extraKey ? "navbar__dropdown--open" : ""
                  }`}
                  style={{
                    maxHeight:
                      isOpen === extraKey
                        ? `${dropdownRefs.current[extraKey]?.scrollHeight}px`
                        : "0px",
                  }}
                  aria-hidden={isOpen !== extraKey}
                  role="menu"
                >
                  {isOpen === extraKey &&
                    items.map((nav, subIndex) => (
                      <li
                        key={`extra-link-${subIndex}`}
                        className="navbar__dropdown-item"
                        role="none"
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
            );
          })}
        </ul>
      </div>
    </div>
  );
}
