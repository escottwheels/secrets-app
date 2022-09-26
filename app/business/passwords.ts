import type { Password, User } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";

export async function createPassword(
  user: User,
  password: string,
  website: string
): Promise<Password> {
  console.log("in createPassword business");
  return await prisma.password.create({
    data: {
      password: password,
      website: website,
      authorId: user.id,
    },
  });
}
