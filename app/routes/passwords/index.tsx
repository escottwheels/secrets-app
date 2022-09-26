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
import { AddIcon, Dialog } from "evergreen-ui";
import { useState } from "react";
import invariant from "tiny-invariant";
export async function loader(args: LoaderArgs) {
  const user = await getUser(args.request);
  if (!user) {
    throw json("No user");
  }
  const passwords = await prisma.password.findMany({ where: { author: user } });
  return json({ user, passwords });
}

export async function action(args: ActionArgs) {
  const body = await args.request.formData();

  const password = body.get("password");
  invariant(password, "Invalid Password");

  const website = body.get("website");
}
export default function PasswordScreen() {
  const actionData = useActionData();
  const [showDialog, setShowDialog] = useState(false);
  const { user, passwords } = useLoaderData<typeof loader>();
  const transition = useTransition();
  const isBusy = transition.submission;
  return (
    <>
      {showDialog && (
        <Dialog
          minHeightContent={40}
          onCloseComplete={() => setShowDialog(false)}
          isShown={showDialog}
          title="Create Password"
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
              <input
                className="rounded-xl mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
                type="submit"
                value={isBusy ? "Creating..." : "Create"}
              />
            </Form>
          }
        ></Dialog>
      )}
      <AddIcon
        className="text-white w-4 h-4"
        onClick={() => setShowDialog(true)}
      />
      <PasswordTable className="mt-2" passwords={passwords}></PasswordTable>
    </>
  );
}
