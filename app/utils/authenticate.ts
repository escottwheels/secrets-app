// our authenticate function receives the Request, the Session and a Headers
import type { User } from "@prisma/client";

import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { login, register, sessionStorage } from "./auth.server";

import invariant from "tiny-invariant";

export let authenticator = new Authenticator<User | Error | null>(sessionStorage, {
  sessionKey: "sessionKey",
  sessionErrorKey: "sessionErrorKey"
});
authenticator.use(
  new FormStrategy(async ({ form }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server  
    const actionType = form.get("_action");
    let password = form.get("password") as any | null;
    let email = form.get("email") as any | null;

    // You can validate the inputs however you want
    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");
    invariant(typeof email === "string", "email must be a string");
    invariant(email.length > 0, "email must not be empty");

    var firstName = form.get("firstName") as any | null;
    var lastName = form.get("lastName") as any | null;
    if (actionType === "register") {
      invariant(typeof firstName === "string", "Invalid first name");
      invariant(typeof lastName === "string", "Invalid last name");
    }


    let user = null;
    try {
      switch (actionType) {
        case "login":
          console.log("in login in authenticator")
          user = await login({ email, password })
          break;
        case "register":
          user = await register({ email, password, firstName, lastName });
          break;
      }
    } catch (error) {
      throw new AuthorizationError("Couldn't authorize user")
    }
    return Promise.resolve(user);
  }),
  "user"
);
