import { NewsPost } from "@prisma/client";
import { SafeUser } from "./user";

export type NewsPostData = Pick<NewsPost, "title" | "content" | "slug"> 

export type SafeNewsPost = Omit<NewsPost, "authorId"> & {
    author?: SafeUser | null;
}