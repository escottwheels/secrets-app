import type { Dispatch, SetStateAction} from "react";
import { useEffect , useState } from "react";
import clsx from "clsx";
import type { Password } from "@prisma/client";
import { EyeIcon, EyeOffIcon, DotsVerticalIcon } from "@heroicons/react/outline";
import { Form } from "@remix-run/react";
import { Checkbox } from "@mui/material";
import { Circle, CircleOutlined, DeleteOutline } from "@mui/icons-material";

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
      <td className="hover:text-cobalt hover:cursor-pointer hover:font-bold px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {password.website}
      </td>
      <td className="flex align-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {canEditPassword && <input type="hidden" name="_action" value="editPassword" />}
        {canEditPassword && <input type="hidden" name="passwordId" value={password.id} />}
        <input onDoubleClick={() => {
          setCanEditPassword(!canEditPassword)
        }}
          name="password"
          onBlur={() => setCanEditPassword(false)}
          className="group px-2 py-1 focus:none focus:outline-none border-b border-stone-light read-only:border-0 read-only:cursor-pointer"
          readOnly={canEditPassword || showPassword ? false : true} type={canEditPassword || showPassword ? "text" : "password"} defaultValue={password.password} />
        {!showPassword ?
          <EyeIcon
            className="w-4 h-4 ml-1 group-hover:visible invisible cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
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
        <DotsVerticalIcon type="" className="w-4 h-4 mr-3 cursor-pointer hover:text-gray-900 text-gray-500"
        // onClick={() => openPasswordMenu(password.id)}
        />
        {/* <Button>Hello</Button> */}
      </td>
    </tr>
  );
};

export const PasswordTable = ({ passwords: items, className, isEditable, InputPasswordRow }: ITableProps) => {
  const [selectedPasswords, setSelectedPasswords] = useState<Record<string, string>>();

  // Resets the selectedPasswords when editable state is changed
  useEffect(() => {
    setSelectedPasswords(undefined)
  }, [isEditable])

  return (
    <Form reloadDocument id="edit-password" method="post">
      <table
        className={clsx(className, "mb-20 bg-white rounded-lg")}
      >
        <thead>
          <tr className={clsx(items && items.length > 0 && "border-b-2", "mx-2")}>
            {isEditable &&
              <th scope="col"
                className="text-sm font-medium text-gray-900">
              </th>}
            <th
              scope="col"
              className="text-sm font-medium text-gray-900  px-6 py-4 text-left"
            >
              WEBSITE
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              PASSWORD
            </th>
            <th>
              {selectedPasswords && Object.keys(selectedPasswords).length >= 1 &&
                <button
                  type="submit"
                  className="w-4 h-4 mr-3 cursor-pointer transition duration-300 ease-in-out hover:text-yellow-400 hover:-translate-y-1 ml-auto inline-block text-cobalt-midnight"
                >
                  <input type="hidden" name="_action" value="deletePassword" />
                  <input type="hidden" name="passwords" value={Object.keys(selectedPasswords)} />
                  {<DeleteOutline />}
                </button>
              }
            </th>
          </tr>
        </thead>
        <tbody className="rounded-xl">
          {InputPasswordRow}
          {items.map((item) => (
            <PasswordRow setSelectedPasswords={setSelectedPasswords} password={item} IsEditable={isEditable} key={item.id} />
          ))}
        </tbody>
      </table >
    </Form >
  );
};