"use client";


import { useState } from "react";

export default function Dropdown({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button className="dropdown__toggle" onClick={toggleDropdown}>
        {title}
      </button>
      {isOpen && <div className="dropdown__content">{children}</div>}
    </div>
  );
}