import { ContentBlock } from "@prisma/client";
import { SafeUser } from "./user";

export type ContentBlockData = Omit<ContentBlock, "id" | "slug" | "authorId" > 

export type ContentUpdateData = Partial<Omit<ContentBlock, "id" | "createdAt" | "slug" | "authorId" | "author">> 

export type SafeContentBlock = Omit<
  ContentBlock,
  "authorId" | "updatedById" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  author?: SafeUser | null;
  updatedBy?: Pick<SafeUser, "id" | "firstName" | "lastName"> | null;
};

export type PublicContent = Pick<ContentBlock, "slug" | "content">;

