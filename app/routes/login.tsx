import { ContentLayout } from "~/components/layout/ContentLayout";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import React, { useRef } from "react";
import { json, type ActionFunction, type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/authenticate";
import { sessionStorage } from "~/utils/auth.server";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

export async function loader(args: LoaderArgs) {
  await authenticator.isAuthenticated(args.request, {
    successRedirect: "/passwords",
  });
  const session = await sessionStorage.getSession(args.request.headers.get('Cookie'))
  const error: { message: string } = session.get(authenticator.sessionErrorKey);

  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export const action: ActionFunction = async ({ request, context }) => {
  const resp = await authenticator.authenticate("user", request, {
    successRedirect: "/passwords",
    failureRedirect: "/login",
    context
  });
  return (resp);
}

function parseLoaderData(data: { error: { message: string; }; }): string {
  let splitData = data.error.message.split(":")
  if (splitData[0] == "Invariant failed") {
    console.log('in invariant failed');
    return splitData.slice(1).join("")
  }
  return data.error.message;
}


export default function Login() {
  const oldLoaderData = useLoaderData<typeof loader>();
  let errorMessage;
  errorMessage = oldLoaderData.error != undefined && parseLoaderData(oldLoaderData)
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigationFormAction = navigation.formData?.get("_action");
  const isBusy = navigation.state == "submitting" && (navigationFormAction == "login" || navigationFormAction == "register")

  const [showMasterPassword, setShowMasterPassword] = React.useState(false);

  const [formAction, setFormAction] = React.useState("login");

  const passwordRef = useRef<HTMLInputElement>(null)


  return (
    <ContentLayout>
      <div className="h-full w-full m-0 p-0 flex justify-center flex-col items-center">
        <button
          onClick={() => setFormAction(formAction === "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          {formAction === "login" ? "Sign Up" : "Log In"}
        </button>
        <div>{actionData}</div>
        <Form method="post" className="rounded-2xl bg-white p-6 w-3/4">

          <label htmlFor="email" className="text-midnight font-semibold">
            Email
          </label>
          <input name="_action" value={formAction} type="hidden" />
          <input
            type="text"
            id="email"
            name="email"
            className="w-full p-2 border focus:outline-cobalt-midnight rounded-xl my-2"
          />
          <span className="flex items-center">
            <label htmlFor="password" className="text-midnight font-semibold">
              Master Password
            </label>
            {!showMasterPassword ? <EyeIcon
              className="h-4 w-4 ml-1 cursor-pointer text-gray-500 hover:text-gray-900"
              onClick={() => {
                setShowMasterPassword(!showMasterPassword);
                passwordRef.current?.focus()
                if (passwordRef.current) {
                  setTimeout(() => {
                    if (passwordRef.current) {
                      passwordRef.current.selectionStart = passwordRef.current.selectionEnd = 10000;
                    }
                  }, 0);
                }
              }}
            /> : <EyeOffIcon
              onClick={() => {
                setShowMasterPassword(!showMasterPassword);
              }}
              className="h-4 ml-1 w-4 cursor-pointer text-gray-500 hover:text-gray-900"
            />}
          </span>
          <input
            ref={passwordRef}
            type={showMasterPassword ? "text" : "password"}
            id="password"
            name="password"
            className="w-full p-2 border focus:outline-cobalt-midnight rounded-xl my-2"
          />
          {formAction === "register" && (
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
                className="w-full p-2 border focus:outline-cobalt-midnight rounded-xl my-2"
              />
              <label htmlFor="lastName" className="text-midnight font-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border focus:outline-cobalt-midnight rounded-xl my-2"
              />
            </>
          )}

          <div className="w-full text-center">
            <input
              type="submit"
              className="cursor-pointer rounded-xl mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
              value={
                formAction === "login"
                  ? isBusy
                    ? "Signing In..."
                    : "Sign In"
                  : isBusy
                    ? "Signing Up..."
                    : "Sign Up"
              }
            />
          </div>
          {errorMessage ?
            <div className="flex justify-center mt-2 text-red-500 bg-stone-light py-2 px-1 rounded-lg bg-opacity-50 text-center items-center font-bold">{errorMessage}</div>
            : null}
        </Form>
      </div>
    </ContentLayout >
  );
}