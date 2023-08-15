import { ContentLayout } from "~/components/layout/ContentLayout";
import { Form, useActionData, useLoaderData, useTransition } from "@remix-run/react";
import React from "react";
import { json, type ActionFunction, type LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/authenticate";
import { sessionStorage } from "~/utils/auth.server";
import { EyeIcon } from "@heroicons/react/outline";

export async function loader(args: LoaderArgs) {
  const session = await sessionStorage.getSession(
    args.request.headers.get('Cookie')
  )
  const error = session.get("sessionErrorKey");

  return json<any>({ error });
}

export const action: ActionFunction = async ({ request, context }) => {
  console.log("In login action");
  const resp = await authenticator.authenticate("user", request, {
    successRedirect: "/passwords",
    failureRedirect: "/login",
    throwOnError: true,
    context
  });
  return resp;
}


export default function Login() {
  const loaderData = useLoaderData();
  const transition = useTransition();
  const actionData = useActionData();
  const isBusy = transition.submission;
  // const [formData, setFormData] = React.useState({
  //   email: "",
  //   password: "",
  //   firstName: "",
  //   lastName: "",
  // });
  const [showMasterPassword, setShowMasterPassword] = React.useState(false);

  const [action, setAction] = React.useState("login");

  return (
    <ContentLayout>
      <div className="h-64 w-64 m-0 p-0 flex justify-center flex-col items-center">
        <button
          onClick={() => setAction(action === "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        >
          {action === "login" ? "Sign Up" : "Log In"}
        </button>
        <div>{actionData}</div>
        <Form method="post" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 w-96">
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
            Master Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border border-colbaltmidnight rounded-xl my-2"
          />
          <EyeIcon
            className="h-6 w-full absolete bottom-24 cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={() => {
              setShowMasterPassword(!showMasterPassword);
            }}
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
                className="w-full p-2 border rounded-xl my-2"
              />
              <label htmlFor="lastName" className="text-midnight font-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full p-2 border rounded-xl my-2"
              />
            </>
          )}

          <div className="w-full text-center">
            <input
              type="submit"
              className="cursor-pointer rounded-xl mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
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
          {loaderData?.error ? <div>{loaderData.error.message}</div> : null}
        </Form>
      </div>
    </ContentLayout >
  );
}