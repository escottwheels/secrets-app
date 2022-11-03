import type { Password, User } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";

export async function addPasswordToUser(
  userId: User["id"],
  password: string,
  website: string
): Promise<Password[]> {
  console.log("in createPassword business");
  console.log("userid", userId);
  const passwords = await prisma.user.update({
    where: { id: userId },
    data: {
      passwords: {
        create: {
          password: password,
          website: website,
        },
      },
    },
    select: {
      passwords: true,
    },
  });
  return passwords.passwords;
}
