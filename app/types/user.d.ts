import { User } from "@prisma/client";

type UserData = Omit<User, "id" | "role">;

type UserRegistrationData = Omit<
  User,
  "id" | "role" | "createdAt" | "updatedAt"
>;

type UserLoginData = Pick<User, "email" | "password">;

type UserUpdateData = Omit<User, "id" | "role" | "createdAt" | "updatedAt">;

type SafeUser = Omit<User, "password">;
