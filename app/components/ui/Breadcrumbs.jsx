"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDynamicNav } from "@/app/context/dynamicNav";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const navData = useDynamicNav();

  if (pathname === "/" || !pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  const formatSlug = (seg) =>
    seg
      .replace(/-/g, " ")
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const items = [
    { href: "/", label: "Hem" },
    ...segments.map((seg, idx) => {
      const href = "/" + segments.slice(0, idx + 1).join("/");
      const entry = navData.find((n) => n.href === href);
      const label = entry?.label || entry?.pageTitle || formatSlug(seg);
      return { href, label };
    }),
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ul className="breadcrumbs">
        {items.map(({ href, label }, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={href} className="breadcrumbs__item">
              {isLast ? (
                <span aria-current="page">{label}</span>
              ) : (
                <p>{label}</p>
              )}
              {!isLast && <span className="breadcrumbs__separator">/</span>}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
