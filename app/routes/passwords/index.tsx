import { LoaderArgs } from "@remix-run/node";
import { prisma } from "~/utils/prisma.server";
import { IPassword, PasswordTable } from "~/components/layout/table";

// export async function loader(args: LoaderArgs) {
//   await prisma.user.findMany({
//     where,
//   });
//   return null;
// }

export default function PasswordScreen() {
  const pass: IPassword[] = [
    {
      password: {
        id: 123,
        authorId: 1,
        password: "Blah123",
        website: "google.com",
      },
      redirectTo: `./${123}`,
    },
    {
      password: {
        id: 456,
        authorId: 2,
        password: "Blah123",
        website: "google.com",
      },
      redirectTo: `./${123}`,
    },
    {
      password: {
        id: 789,
        authorId: 3,
        password: "Blah123",
        website: "google.com",
      },
      redirectTo: `./${123}`,
    },
    {
      password: {
        id: 948,
        authorId: 4,
        password: "Blah123",
        website: "google.com",
      },
      redirectTo: `./${123}`,
    },
  ];
  return <PasswordTable className="mt-2" passwords={pass}></PasswordTable>;
}
