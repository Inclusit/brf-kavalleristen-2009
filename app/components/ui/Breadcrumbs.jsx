"use client";

import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter((segment) => segment !== "");
    
    return (
        <nav className="breadcrumbs">
        <ul className="breadcrumbs__list">
            {pathSegments.map((segment, index) => {
            const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
            return (
                <li key={index} className="breadcrumbs__item">
                <a href={path} className="breadcrumbs__link">
                    {segment}
                </a>
                {index < pathSegments.length - 1 && <span className="breadcrumbs__separator">/</span>}
                </li>
            );
            })}
        </ul>
        </nav>
    );
    }
    