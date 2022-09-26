import type { ActionArgs, LoaderArgs} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export function action(args: ActionArgs) {
  return logout(args.request);
}

export async function loader(args: LoaderArgs) {
  return redirect("/");
}
