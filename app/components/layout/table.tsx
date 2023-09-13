import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import clsx from "clsx";
import type { Password } from "@prisma/client";
import { EyeIcon, EyeOffIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { Form, useNavigation } from "@remix-run/react";
import { Checkbox } from "@mui/material";
import { Circle, CircleOutlined, DeleteOutline } from "@mui/icons-material";
import { ClipLoader } from "react-spinners";

export type ITableProps = {
  passwords: Password[];
  className?: string;
  InputPasswordRow?: JSX.Element;
  isEditable: boolean;
};
type PasswordRowProps = {
  setSelectedPasswords: Dispatch<SetStateAction<Record<string, string> | undefined>>;
  password: Password;
  className?: string;
  IsEditable: boolean
};

type PasswordTextProps = {
  password: Password;
  className?: string;
};

export const PasswordText = ({ password, className }: PasswordTextProps) => {
  return (
    <span className={clsx(className)}>
      {password.password}
    </span>
  );
};

export const PasswordRow = ({ password, className, IsEditable, setSelectedPasswords }: PasswordRowProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [canEditPassword, setCanEditPassword] = useState(false)

  return (
    <tr
      className={clsx(className, "transition duration-300 ease-in-out")}
      key={password.id}
    >
      {IsEditable &&
        <td>
          <Checkbox
            name={`${password.website}-select`}
            className="ml-4"
            icon={<CircleOutlined className="text-black" />}
            checkedIcon={<Circle />}
            inputProps={{
              'aria-label': `${password.website} Checkbox`
            }}
            onChange={(e) => {
              if (e.target.checked) {
                const newValue: Record<string, string> = {}
                newValue[password.id] = password.website
                setSelectedPasswords(value => ({
                  ...value,
                  ...newValue
                }))
              }
              else {
                setSelectedPasswords(value => {
                  const updatedState = value ?? {}
                  delete updatedState[password.id]
                  return ({
                    ...updatedState
                  })
                })

              }
            }} />
        </td>}
      <td
        className="hover:text-cobalt hover:cursor-pointer hover:font-bold px-6 py-4 text-sm font-medium text-gray-900">
        <span>{password.website}</span>
      </td>
      <td className="group inline-flex items-center px-6 py-4 text-sm font-medium text-gray-900">
        {canEditPassword && <input type="hidden" name="_action" value="editPassword" />}
        {canEditPassword && <input type="hidden" name="passwordId" value={password.id} />}
        {canEditPassword && <input type="submit" style={{ display: "none" }} />}
        <input onDoubleClick={() => {
          setCanEditPassword(!canEditPassword)
          setShowPassword(false)
        }}
          name="password"
          onBlur={() => setCanEditPassword(false)}
          className="group flex items-center px-2 py-1 focus:none focus:outline-none border-b border-stone-light read-only:border-0 read-only:cursor-pointer"
          readOnly={canEditPassword ? false : true} type={canEditPassword || showPassword ? "text" : "password"} defaultValue={password.password} />
        {!showPassword ?
          <EyeIcon
            className="w-4 h-4 ml-1 disabled:invisible group-hover:visible invisible cursor-pointer text-gray-500 hover:text-gray-900"
          />
          : <EyeOffIcon
            className="w-4 h-4 ml-1 group-hover:visible invisible cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
        }
      </td>
      <td className="text-gray-500 hover:text-gray-900  ">
        <DotsVerticalIcon className="w-4 h-4 mr-3 text-white"
        />
      </td>
    </tr>
  );
};

export const PasswordTable = ({ passwords: items, className, isEditable, InputPasswordRow }: ITableProps) => {
  const [selectedPasswords, setSelectedPasswords] = useState<Record<string, string>>();
  const navigation = useNavigation();
  const isDeletingPasswords = navigation.state === "submitting" && navigation.formData?.get("_action") === "deletePassword"


  function checkPasswordsAreDeleting() {
    if (isDeletingPasswords === true) {
      window.setTimeout(checkPasswordsAreDeleting, 10); /* this checks the flag every 100 milliseconds*/
    }
    else {
      setSelectedPasswords(undefined)
    }
  }

  return (
    <Form id="edit-password" method="post">
      <table
        className={clsx(className, "mb-20 bg-white rounded-lg")}
      >
        <thead>
          <tr className="border-b-2 mx-2">
            {isEditable &&
              <th scope="col"
                className="text-sm font-medium text-gray-900">
              </th>}
            <th
              scope="col"
              className="w-1/2 text-sm font-medium text-gray-900  px-6 py-4 text-left"
            >
              WEBSITE
            </th>
            <th
              scope="col"
              className="w-1/2 text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              PASSWORD
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 text-left">
              {selectedPasswords && Object.keys(selectedPasswords).length >= 1 &&
                <button
                  type="submit"
                  className="w-4 h-4 flex justify-center items-center cursor-pointer transition duration-300 ease-in-out hover:text-yellow-400 hover:-translate-y-1 text-cobalt-midnight"
                >
                  <input type="hidden" name="_action" value="deletePassword" />
                  <input type="hidden" name="passwords" value={Object.keys(selectedPasswords)} />
                  {!isDeletingPasswords &&
                    <DeleteOutline
                      onClick={async () => {
                        await new Promise(resolve => setTimeout(resolve, 100))
                        checkPasswordsAreDeleting();
                      }} />
                  }
                  {<ClipLoader size={25} loading={isDeletingPasswords} />}
                </button>
              }
            </th>
          </tr>
        </thead>
        <tbody className="rounded-xl">
          {items.length == 0 && InputPasswordRow == null
            &&
            // <span className="font-bold bg-white w-full flex text-center justify-center items-center text-cobalt">No password. Click the plus sign to add some secrets!</span>
            <tr>
              <td colSpan={4} className=" py-8 px-2 w-full font-bold grow text-center">
                <div className="font-extrabold text-xl text-cobalt">No passwords currently entered </div>
                <div className="text-stone-light">
                  Click the plus sign to add some secrets!
                </div>
              </td>
            </tr>

          }
          {InputPasswordRow}
          {items.map((item) => (
            <PasswordRow setSelectedPasswords={setSelectedPasswords} password={item} IsEditable={isEditable} key={item.id} />
          ))}
        </tbody>
      </table >
    </Form >
  );
};