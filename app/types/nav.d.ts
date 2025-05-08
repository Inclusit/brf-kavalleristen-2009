import { Navigation } from "@prisma/client";

export type NavigationData = {
    id: string;
    category: string;
    label: string;
    href: string;
}