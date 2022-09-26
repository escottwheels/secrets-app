import clsx from "clsx";
import type { Password } from "@prisma/client";
import { PlusCircleIcon } from "@heroicons/react/outline";
import { useNavigate } from "@remix-run/react";

export type ITableProps = {
  passwords: Password[];
  className?: string;
};

export const PasswordTable = ({ passwords: items, className }: ITableProps) => {
  const navigate = useNavigate();
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
          <tr
            className="odd:bg-white even:bg-slate-200"
            key={item.id}
            onClick={() => navigate(item.id)}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.website}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              **************
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {item.authorId}
            </td>
          </tr>
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
