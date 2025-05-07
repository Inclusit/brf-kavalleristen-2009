import { ContentBlock } from "@prisma/client";
import { SafeUser } from "./user";

export type ContentBlockData = Omit<ContentBlock, "id" | "createdAt" | "slug" > 

export type SafeContentBlock = Omit<ContentBlock, "authorId"> & {
    author?: SafeUser | null;
};