import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";
type createUserProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const createOrFindUser = async ({
  email,
  password,
  firstName,
  lastName
}: createUserProps) => {
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
        firstName: firstName,
        lastName: lastName
      },
    });
  }
  return user;
};
