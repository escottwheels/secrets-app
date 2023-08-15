import type { ActionArgs, MetaFunction , LoaderArgs } from "@remix-run/node";

import styles from "../styles/app.css";
import { authenticator } from "~/utils/authenticate";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "secrets",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader(args: LoaderArgs) {
  return await authenticator.isAuthenticated(args.request, {
    successRedirect: "/passwords",
    failureRedirect: "/login"
  });

}

export async function action(args: ActionArgs) {
  await authenticator.logout(args.request, { redirectTo: "/login" });
}


