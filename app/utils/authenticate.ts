// our authenticate function receives the Request, the Session and a Headers
import type { User } from "@prisma/client";
import { redirect, Session } from "@remix-run/node";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./auth.server";

import invariant from "tiny-invariant";
import bcrypt from "bcryptjs";
import { createOrFindUser } from "./user.server";
import { logger } from "./logger";

export let authenticator = new Authenticator<User>(sessionStorage);
authenticator.use(
  new FormStrategy(async ({ form }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    console.log("in authenticator");
    let password = form.get("password");
    let email = form.get("email");
    console.log(email, password);
    // You can validate the inputs however you want
    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    invariant(typeof email === "string", "emailemail must be a string");
    invariant(email.length > 0, "email must not be empty");

    // And if you have a password you should hash it
    let hashedPassword = await bcrypt.hash(password, 10);

    // And finally, you can find, or create, the user
    let user = await createOrFindUser({
      email,
      password: hashedPassword,
    });

    // And return the user as the Authenticator expects it
    return user;
  }),
  "user-pass"
);
// we make the headers optional so loaders don't need to pass one
