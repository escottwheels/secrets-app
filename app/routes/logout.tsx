import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";
import { authenticator } from "~/utils/authenticate";

export async function action(args: ActionArgs) {
  await authenticator.logout(args.request, { redirectTo: "/" });
}

export async function loader(args: LoaderArgs) {
  return redirect("/");
}
