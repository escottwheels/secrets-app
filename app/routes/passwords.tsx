import { UserCircleIcon } from '@heroicons/react/outline';

import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import type { User } from "@prisma/client";
import { PasswordTable } from "~/components/layout/table";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { AddIcon } from "evergreen-ui";
import { useEffect, useState } from "react";
import { addPasswordToUser } from "~/business/passwords";

import invariant from "tiny-invariant";
import { authenticator } from "~/utils/authenticate";

export async function loader(args: LoaderArgs) {
  console.log("in passwords Loader");
  const user = await authenticator.isAuthenticated(args.request, {
    failureRedirect: "/",
  }) as User;
  const passwords = await prisma.password.findMany({ where: { author: user } });
  return json({ user: user, passwords: passwords });
}

export async function action(args: ActionArgs) {
  console.log('in passwords action');
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

const AddPasswordInputs = ({ userId }: { userId: string }) => {
  return (
    <tr
      className="md:max-w-xl max-w-xs inline-flex table-row odd:bg-white even:bg-slate-200"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <input form="add-password" className=" h-6" id="webiste" name="website" autoFocus />
      </td>
      <td className="group flex align-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <input form="add-password" className="h-6" type="sub" name="password" id="password" />
        <input form="add-password" type="hidden" name="userId" value={userId} />
        {/* <CheckIcon type="submit" className='text-black' />
         */}
        {/* <button type="submit">Submit</button> */}
      </td>
    </tr>
  )
}

export default function PasswordScreen() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [showAddPasswordFields, setShowAddPasswordFields] = useState(false);
  const [showDetermineStrength, setShowDetermineStrength] = useState(false);
  const [openProfileScreen, setOpenProfileScreen] = useState(false);
  const { user, passwords } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionData === "success") {
      setShowAddPasswordFields(false);
    }
  }, [actionData]);

  return (
    <div className="flex justify-center"
    >
      <UserCircleIcon className="z-10 cursor-pointer absolute w-12 h-10 top-8 right-0 mr-6 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition 
      duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
        onClick={() => {
          setOpenProfileScreen(!openProfileScreen);
          setShowDetermineStrength(false)
          navigate(openProfileScreen ? ".." : "profile")
        }}
      />
      {!showDetermineStrength && openProfileScreen && <Outlet />}
      <div className="grow md:max-w-xl max-w-xs">
        <div className="flex justify-center justify-end">
          <button
            className="grow mr-2 flex-end rounded-xl w-30 h-15 mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            onClick={() => {
              navigate(showDetermineStrength ? "../" : "strength")
              setShowDetermineStrength(!showDetermineStrength)
              setOpenProfileScreen(false)
            }}
          >
            {showDetermineStrength && !openProfileScreen ? "Back" : "find passwords strength"}
          </button>
          {!showDetermineStrength && <button
            className="flex-end rounded-xl w-30 h-15 mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            onClick={() => {
              setShowAddPasswordFields(!showAddPasswordFields);
            }}
          >
            <AddIcon />
          </button>}
        </div>
        <Outlet />
        <PasswordTable className="mt-2 w-full md:max-w-xl max-w-xs" InputPasswordRow={showAddPasswordFields ? <AddPasswordInputs userId={user.id} /> : undefined} passwords={passwords}></PasswordTable>
      </div>
    </div >
  );
}
