import { ContentLayout } from "~/components/layout/ContentLayout";
import invariant from "tiny-invariant";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/outline";
import React from "react";
import type { ActionFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";
import { login, register } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const actionType = body.get("_action");
  const email = body.get("email");
  invariant(typeof email === "string", "Invalid Email");
  const password = body.get("password");
  invariant(typeof password === "string", "Invalid password");
  var firstName = body.get("firstName");
  var lastName = body.get("lastName");
  if (actionType === "register") {
    invariant(typeof firstName === "string", "Invalid first name");
    invariant(typeof lastName === "string", "Invalid last name");
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(actionType === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: actionType,
      },
      { status: 400 }
    );
  }

  switch (actionType) {
    case "login":
      return await login({ email, password });

    case "register":
      firstName = firstName as string;
      lastName = lastName as string;

      return await register({ email, password, firstName, lastName });
  }
};

export default function Login() {
  const transition = useTransition();
  const actionData = useActionData();
  const isBusy = transition.submission;
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
    // 👇 New fields
    firstName: "",
    lastName: "",
  });
  const [action, setAction] = React.useState("login");

  return (
    <ContentLayout>
      <div className="overflow-x-hidden m-0 p-0 bg-cobalt w-screen h-screen flex justify-center flex-col items-center">
        <button
          onClick={() => setAction(action === "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          {action === "login" ? "Sign Up" : "Log In"}
        </button>
        <div>{actionData}</div>
        <Form method="post" className="rounded-2xl bg-white p-6 w-96">
          <label htmlFor="email" className="text-midnight font-semibold">
            Email
          </label>
          <input name="_action" value={action} type="hidden" />
          <input
            type="text"
            id="email"
            name="email"
            className="w-full p-2 border border-midnight rounded-xl my-2"
          />

          <label htmlFor="password" className="text-midnight font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2  border border-colbaltmidnight rounded-xl my-2"
          />

          {action === "register" && (
            <>
              <label
                htmlFor="firstName"
                className="text-midnight font-semibold"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full p-2 border border-midnight rounded-xl my-2"
              />
              <label htmlFor="lastName" className="text-midnight font-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border border-midnight rounded-xl my-2"
              />
            </>
          )}

          <div className="w-full text-center">
            <input
              type="submit"
              className="rounded-xl mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value={
                action === "login"
                  ? isBusy
                    ? "Signing In..."
                    : "Sign In"
                  : isBusy
                  ? "Signing Up..."
                  : "Sign Up"
              }
            />
          </div>
        </Form>
      </div>
    </ContentLayout>
  );
}
