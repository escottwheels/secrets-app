import type { RegisterForm, LoginForm } from "./types.server";
import { prisma } from "./prisma.server";
import { createCookieSessionStorage } from "@remix-run/node";
import { createOrFindUser } from "./user.server";
import bcrypt from "bcryptjs";

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
    maxAge: 60 * 60 * 24 * 30,
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
    return null;
  }
  return user
}

// function getUserSession(request: Request) {
//   return sessionStorage.getSession(request.headers.get("Cookie"));
// }

// export async function createUserSession(userId: number, redirectTo: string) {
//   const session = await sessionStorage.getSession();

//   session.set("userId", userId);
//   console.log("user session, userid: ", session.get("userId"));
//   return redirect(redirectTo, {
//     headers: {
//       "Set-Cookie": await sessionStorage.commitSession(session),
//     },
//   });
// }


// export async function getUserId(request: Request) {
//   const session = await getUserSession(request);
//   const userId = session.get("userId");
//   if (!userId || typeof userId !== "number") return null;
//   return userId;
// }

/**
 * Returns the user object from the userId retreived from the request object
 * @param request The request object sent with the session
 * @returns
 */
// export async function getUser(request: Request) {
//   const userId = await getUserId(request);
//   if (typeof userId !== "number") {
//     return null;
//   }
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId.toString() },
//     });
//     return user;
//   } catch {
//     throw logout(request);
//   }
// }
