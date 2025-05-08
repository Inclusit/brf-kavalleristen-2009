import { ContentBlock } from "@prisma/client";
import { SafeUser } from "./user";

export type ContentBlockData = Omit<ContentBlock, "id" | "slug" | "authorId" > 

export type ContentUpdateData = Partial<Omit<ContentBlock, "id" | "createdAt" | "slug" | "authorId" | "author">> 

export type SafeContentBlock = Omit<ContentBlock, "authorId"> & {
    author?: SafeUser | null;
};

export type PublicContent = Pick<ContentBlock, "slug" | "content">;

