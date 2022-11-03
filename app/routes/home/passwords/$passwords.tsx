import type { LoaderArgs } from "@remix-run/node";
import { Dialog } from "evergreen-ui";
import invariant from "tiny-invariant";

export async function loader(args: LoaderArgs) {
  const { passwordId } = args.params;
  invariant(typeof passwordId == "string", "invalid PasswordId");
  return null;
}

export default function Password() {}
