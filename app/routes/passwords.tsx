import { UserCircleIcon, PlusIcon, PencilIcon, XIcon } from '@heroicons/react/outline';
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import type { User } from "@prisma/client";
import { PasswordTable } from "~/components/layout/table";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { addPasswordToUser, deletePasswordsFromUser, editPassword } from "~/business/passwords";

import invariant from "tiny-invariant";
import { authenticator } from "~/utils/authenticate";
import clsx from 'clsx';
import { UndoOutlined } from '@mui/icons-material';

export async function loader(args: LoaderArgs) {
  const user = await authenticator.isAuthenticated(args.request, {
    failureRedirect: "/",
  }) as User;
  const passwords = (await prisma.password.findMany({
    orderBy: [{ website: 'asc' }], where: { author: user }
  }))
  return json({ user: user, passwords: passwords });
}

export async function action(args: ActionArgs) {
  const body = await args.request.formData()
  const actionType = body.get("_action")
  switch (actionType) {
    case "addPassword": {
      const password = body.get("password");
      invariant(typeof password === "string", "Invalid password");
      const website = body.get("website");
      invariant(typeof website === "string", "Invalid website");
      const userId = body.get("userId");
      invariant(typeof userId === "string", "Invalid userId");
      await addPasswordToUser(userId, password, website);
      return "success"
    }
    case "deletePassword": {
      const { user } = await (await loader(args)).json()
      let passwordsData = body.get("passwords");
      invariant(passwordsData, "Must have passwords")
      invariant(typeof passwordsData === "string", "List must be of password Ids")
      const passwords = passwordsData.split(",")
      await deletePasswordsFromUser(user.id, passwords.map(p => parseInt(p)))
      return null;
    }
    case "editPassword": {
      const passwordId = body.get("passwordId")
      invariant(typeof passwordId === "string", "Invalid updated password id")
      const newPassword = body.get("password")
      invariant(typeof newPassword === "string", "Invalid updated password")
      await editPassword(parseInt(passwordId), newPassword);
      return null
    }
  }
  return null
}

const AddPasswordInputs = ({ userId }: { userId: string }) => {

  return (
    <tr
      className="md:max-w-xl max-w-xs table-row even:bg-slate-200"
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <input form="edit-password" placeholder="technologyunleashed.org" className="px-2 py-1 rounded-lg border border-stone-light focus:outline-cobalt h-8 placeholder:italic" id="webiste" name="website" autoFocus />
      </td>
      <td className="group flex align-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <input form="edit-password" placeholder='Str4gP@ssword123' className="px-2 py-1 rounded-lg border border-stone-light focus:outline-cobalt h-8 placeholder:italic" type="sub" name="password" id="password" />
        <input form="edit-password" type="hidden" name="userId" value={userId} />
        <input form="edit-password" type="hidden" name="_action" value={"addPassword"} />
        <button type="submit"></button>
      </td>
    </tr>
  )
}

export default function PasswordScreen() {
  const [showAddPasswordFields, setShowAddPasswordFields] = useState(false);
  const [isEditable, setIsEditable] = useState(false)


  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData();
  const location = useLocation();

  const isSimilarityScorePageOpen = location.pathname.includes("strength");
  const isProfilePageOpen = location.pathname.includes("profile")

  const { user, passwords } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (actionData === "success") {
      setShowAddPasswordFields(false);
    }
  }, [actionData]);

  return (
    <div className="flex justify-center text-white"
    >
      <UserCircleIcon className={clsx(isProfilePageOpen && "border border-white", "z-10 cursor-pointer absolute w-12 h-10 top-8  right-0 mr-6 rounded-xl bg-cobalt-midnight font-semibold text-white px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1")}
        onClick={() => {
          navigate(isProfilePageOpen ? ".." : "profile")
        }}
      />
      {isProfilePageOpen && <Outlet />}
      <div className="grow md:max-w-xl">
        <div className="flex justify-center justify-end">
          <button
            className="grow mr-2 flex-end rounded-xl w-30 h-15 mt-2 bg-cobalt-midnight px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-red-500 hover:-translate-y-1"
            onClick={() => {
              navigate(isSimilarityScorePageOpen ? "../" : "strength")
            }}
          >
            {(navigation.location?.pathname.includes("strength")) ? "Finding... " : isSimilarityScorePageOpen ? "Back" : "Find password similarity"}
          </button>
          <button
            disabled={isEditable}
            className="flex-end mr-2 rounded-xl bg-cobalt-midnight disabled:bg-stone-light disabled:transform-none w-30 h-15 mt-2 px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            onClick={() => {
              if (showAddPasswordFields) {
                window.history.back()
              }
              else {
                window.history.pushState(null, "", "http://localhost:3000/passwords/add")
              }
              setShowAddPasswordFields(!showAddPasswordFields)
            }}
          >
            {!showAddPasswordFields ? <PlusIcon className="h-6 w-6 text-white" /> : <UndoOutlined className="h-6 w-6 text-white" />}
          </button>
          <button
            disabled={showAddPasswordFields}
            className="flex-end rounded-xl w-30 h-15 mt-2 bg-cobalt-midnight disabled:bg-stone-light disabled:transform-none px-3 py-2 text-white font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:-translate-y-1"
            onClick={() => setIsEditable(!isEditable)}
          >
            {!isEditable ? <PencilIcon className="h-6 w-6 text-white" /> : <XIcon className="h-6 w-6 text-white" />}
          </button>
        </div>
        {isSimilarityScorePageOpen && <Outlet />}
        <PasswordTable isEditable={isEditable} className="mt-2 w-full" InputPasswordRow={showAddPasswordFields ? <AddPasswordInputs userId={user.id} /> : undefined} passwords={passwords}></PasswordTable>
      </div>
    </div >
  );
}
