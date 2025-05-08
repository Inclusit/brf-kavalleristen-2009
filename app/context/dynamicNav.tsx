import { use, useEffect, useState } from "react";

export type NavigationData = {
    id: string;
    category: string;
    label: string;
    href: string;
}

export function useDynamicNav() {
    const [nav, setNav ] = useState<NavigationData[]>([]);

    useEffect(() => {
        const fetchNav = async () => {
            try {
                const response = await fetch("/api/nav", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch navigation data");
                }

                const data = await response.json();
                setNav(data);
            } catch (error) {
                console.error("Error fetching navigation data:", error);
            }
        };

        fetchNav();

    }, []);

    return nav;
}