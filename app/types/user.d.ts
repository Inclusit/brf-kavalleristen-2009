import { User } from "@prisma/client";

type UserData = Omit<User, "id" | "role" | "createdAt" | "updatedAt">;;

type UserRegistrationData = Omit<
  User,
  "id" | "role" | "createdAt" | "updatedAt"
>;

type UserLoginData = Pick<User, "email" | "password">;

type UserUpdateData = Omit<User,"createdAt" | "updatedAt">;

export type SafeUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  role: string;
  createdAt: string; 
  updatedAt: string;
};
