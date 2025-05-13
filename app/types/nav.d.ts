import { Navigation } from "@prisma/client";

export type NavigationData = {
    id: string;
    category: string;
    label: string;
    pageTitle: string;
    href: string;
    authOnly?: boolean;
}