import clsx from "clsx";
import type { Password } from "@prisma/client";
import { PencilIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useNavigate } from "@remix-run/react";
import { DeleteIcon } from "evergreen-ui";
import { useState } from "react";

export type ITableProps = {
  passwords: Password[];
  className?: string;
};
type PasswordProps = {
  children: Password;
};

export const PasswordText = ({ children: password }: PasswordProps) => {
  const [copiedText, setCopiedText] = useState("");
  function copyText() {}

  return (
    <span onClick={() => setCopiedText(password.password)}>
      {password.password}
    </span>
  );
};

export const PasswordRow = ({ children: password }: PasswordProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <tr
      className="group odd:bg-white even:bg-slate-200"
      key={password.id}
      onClick={() => navigate(password.id)}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {password.website}
      </td>
      <td className="flex align-center px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {showPassword ? (
          <PasswordText>{password}</PasswordText>
        ) : (
          "**************"
        )}
        <PencilIcon
          className="w-4 h-4 ml-2 invisible group-hover:visible text-black cursor-pointer text-gray-500 hover:text-gray-900"
          onClick={() => {
            setShowPassword(!showPassword);
          }}
        />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <DeleteIcon className="text-red w-4 h-4å" />
      </td>
    </tr>
  );
};

export const PasswordTable = ({ passwords: items, className }: ITableProps) => {
  return (
    <table
      className={clsx(className, "table-auto w-3/4 bg-slate-200 rounded-md")}
    >
      <thead>
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            website
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            password
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
          >
            actions
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <PasswordRow key={item.id}>{item}</PasswordRow>
        ))}
      </tbody>
    </table>
  );
};

// export const ITable = ({ passwords, className }: ITableProps) => {
//   const navigate = useNavigate();
//   return (
//     <Table className={clsx(className, "w-3/4 h-3/4 rounded-lg")}>
//       <Table.Head>
//         <Table.SearchHeaderCell />
//         <Table.TextHeaderCell>password</Table.TextHeaderCell>
//         <Table.TextHeaderCell>actions</Table.TextHeaderCell>
//       </Table.Head>
//       <Table.Body height={240}>
//         {passwords.map((password) => (
//           <Table.Row
//             key={password.password.id}
//             isSelectable
//             onSelect={() => {
//               console.log("here");
//               navigate(password.redirectTo);
//             }}
//           >
//             <Table.TextCell>{password.password.website}</Table.TextCell>
//             <Table.TextCell>************</Table.TextCell>
//             <Table.TextCell isNumber>
//               {<PlusCircleIcon className="w-4 h-4 text-slate-300" />}
//             </Table.TextCell>
//           </Table.Row>
//         ))}
//       </Table.Body>
//     </Table>
//   );
// };
