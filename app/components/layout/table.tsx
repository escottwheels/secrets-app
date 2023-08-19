import clsx from "clsx";
import type { Password } from "@prisma/client";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Form } from "@remix-run/react";
import { useState } from "react";

export type ITableProps = {
  passwords: Password[];
  className?: string;
  InputPasswordRow?: JSX.Element;
};
type PasswordProps = {
  children: Password;
};

export const PasswordText = ({ children: password }: PasswordProps) => {
  return (
    <span>
      {password.password}
    </span>
  );
};

export const PasswordRow = ({ children: password }: PasswordProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <tr
      className="odd:bg-white even:bg-slate-200"
      key={password.id}
    >
      <td className="uppercase px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {password.website}
      </td>
      <td className="group flex align-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {showPassword ? (
          <PasswordText>{password}</PasswordText>
        ) : (
          <span className="mr-2">**************</span>
        )}
        {!showPassword ?
          <EyeIcon
            className="w-4 h-4 ml-auto group-hover:visible cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
          : <EyeOffIcon
            className="w-4 h-4 ml-auto group-hover:visible cursor-pointer text-gray-500 hover:text-gray-900"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
          />
        }
      </td>
    </tr>
  );
};

export const PasswordTable = ({ passwords: items, className, InputPasswordRow }: ITableProps) => {
  return (
    <Form className="grow" id="add-password" method="post">
      <table
        className={clsx(className, "table-auto bg-slate-200 rounded-xl")}
      >
        <thead>
          <tr>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              WEBSITE
            </th>
            <th
              scope="col"
              className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              PASSWORD
            </th>
          </tr>
        </thead>
        <tbody className="rounded-xl">
          {InputPasswordRow}
          {items.map((item) => (
            <PasswordRow key={item.id}>{item}</PasswordRow>
          ))}
        </tbody>
      </table>
    </Form>
  );
};