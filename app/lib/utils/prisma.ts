import { PrismaClient } from "@prisma/client";

export async function userExists(
  client: PrismaClient,
  email: string
): Promise<boolean> {
  const user = await client.user.findFirst({
    where: {
      email: email,
    },
  });
  return !!user;
}
