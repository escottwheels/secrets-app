import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { Password } from "@prisma/client";
import { PasswordTable } from "~/components/layout/table";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { getUser, getUserId } from "~/utils/auth.server";
import { AddIcon, Button, Dialog } from "evergreen-ui";
import { useEffect, useState } from "react";
import { addPasswordToUser } from "~/business/passwords";

import invariant from "tiny-invariant";
import { authenticator } from "~/utils/authenticate";

export async function loader(args: LoaderArgs) {
  console.log("in passwords Loader");
  const user = await authenticator.isAuthenticated(args.request, {
    failureRedirect: "/",
  });
  const passwords = await prisma.password.findMany({ where: { author: user } });
  return json({ user: user, passwords: passwords });
}

export async function action(args: ActionArgs) {
  const body = await args.request.formData();
  const password = body.get("password");
  invariant(typeof password === "string", "Invalid Password");
  const website = body.get("website");
  invariant(typeof website === "string", "Invalid website");
  const userId = body.get("userId");
  invariant(typeof userId === "string", "Invalid userId");

  await addPasswordToUser(userId, password, website);
  return "success";
}
export default function PasswordScreen() {
  const actionData = useActionData();
  const [showDialog, setShowDialog] = useState(false);
  const { user, passwords } = useLoaderData<typeof loader>();
  const transition = useTransition();
  const isBusy = transition.submission;

  useEffect(() => {
    if (actionData === "success") {
      setShowDialog(false);
    }
  }, [actionData]);

  return (
    <>
      {showDialog && (
        <Dialog
          minHeightContent={0}
          onCloseComplete={() => setShowDialog(false)}
          isShown={showDialog}
          header={false}
          footer={
            <Form method="post">
              <label htmlFor="password" id="password">
                Enter your Password
              </label>
              <input
                className="w-full p-2 border border-midnight rounded-xl my-2"
                name="password"
                type="password"
                id="password"
              />
              <label htmlFor="website" id="website">
                Enter the website this password is for
              </label>
              <input
                className="w-full p-2 border border-midnight rounded-xl my-2"
                name="website"
                type="text"
                id="website"
              />
              <input type="hidden" name="userId" value={user.id} />
              <input
                className="rounded-xl mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                type="submit"
                value={isBusy ? "Creating..." : "Create"}
              />
            </Form>
          }
        ></Dialog>
      )}

      <div className="flex justify-end">
        <button
          className="flex-end rounded-xl w-30 h-15 mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
          onClick={() => {
            setShowDialog(true);
          }}
        >
          add password
        </button>
      </div>
      <PasswordTable className="mt-2" passwords={passwords}></PasswordTable>
    </>
  );
}
