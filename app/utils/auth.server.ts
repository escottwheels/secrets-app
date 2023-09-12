import type { RegisterForm, LoginForm } from "./types.server";
import { prisma } from "./prisma.server";
import { createCookieSessionStorage } from "@remix-run/node";
import { createOrFindUser } from "./user.server";
import bcrypt from "bcryptjs";
import { AuthorizationError } from "remix-auth";

// COOKIE STORAGE STUFF
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "secrets-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 1 * 60 * 30,
    httpOnly: true,
  },
});

// Pulled From: https://www.prisma.io/blog/fullstack-remix-prisma-mongodb-2-ZTmOy58p4re8#create-an-instance-of-prisma
export async function register(user: RegisterForm) {
  const exists = await prisma.user.count({ where: { email: user.email } });
  if (exists) {
    return null;
  }

  const newUser = await createOrFindUser(user);
  if (!newUser) {
    return null;
  }
  return newUser;
}

export async function login({ email, password }: LoginForm) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AuthorizationError("Username doesn't exist or password is incorrect. Try again");
  }
  return user
}
