import type { ActionArgs } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { Button, Dialog, Pane } from "evergreen-ui";
import { useState } from "react";
import { getUserId } from "~/utils/auth.server";

export async function action(args: ActionArgs) {
  const userId = getUserId();
  const body = args.request.formData();
}
