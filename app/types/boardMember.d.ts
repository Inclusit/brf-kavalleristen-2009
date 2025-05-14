import { BoardMember } from '@prisma/client';

export type BoardMemberCreateData = Omit<
  BoardMembers,
  "id" | "createdAt" | "updatedAt"
>;

export type BoardMemberUpdateData = Omit<
  BoardMembers,
  "createdAt" | "updatedAt"
>;

export type SafeBoardMember = {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};