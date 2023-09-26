import type { Password, User } from "@prisma/client";
import { prisma } from "~/utils/prisma.server";

export async function addPasswordToUser(
  userId: User["id"],
  password: string,
  website: string
): Promise<Password[]> {

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

export async function deletePasswordsFromUser(
  userId: User["id"],
  passwordIds: Password["id"][]
): Promise<number> {

  const updatedPasswords = await prisma.password.deleteMany({
    where: {
      authorId: userId,
      id: {
        in: passwordIds
      }
    }
  });
  return updatedPasswords.count
}



export async function editPassword(
  passwordId: Password["id"],
  newPassword: Password["password"]
): Promise<Password> {

  const updatedPassword = await prisma.password.update({
    where: {
      id: passwordId
    },
    data: {
      password: newPassword
    }
  });
  return updatedPassword
}