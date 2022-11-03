import bcrypt from "bcryptjs";
import type { RegisterForm } from "./types.server";
import { prisma } from "./prisma.server";
type createUserProps = {
  email: string;
  password: string;
};

export const createOrFindUser = async ({
  email,
  password,
}: createUserProps) => {
  console.log("in createOrFindUser");
  const passwordHash = await bcrypt.hash(password, 10);
  let user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        password: passwordHash,
        email: email,
      },
    });
  }
  return user;
};
