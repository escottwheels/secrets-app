import { LockClosedIcon } from "@heroicons/react/outline";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ContentLayout } from "./components/layout/ContentLayout";
import type { NavBarItem } from "./components/layout/NavBar";
import { NavBar } from "./components/layout/NavBar";

import styles from "./styles/app.css";
import { getUser } from "./utils/auth.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader(args: LoaderArgs) {
  const user = await getUser(args.request);
  if (!user) {
    throw json("NO user");
  }

  return json({ user });
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  const navBaritems: NavBarItem[] = [
    { name: "Passwords", to: "./passwords", prefetch: "intent" },
  ];

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="bg-cobalt h-screen flex items-center flex-col">
          <ContentLayout>
            <div className="overflow-x-hidden m-0 p-0 bg-cobalt w-screen h-screen flex justify-center flex-col items-center">
              <span className="text-white">{`${user.firstName} ${user.lastName}`}</span>

              <span className="flex items-center">
                <h2 className="text-white font-extrabold text-9xl mb-10">
                  secrets
                </h2>
                <LockClosedIcon className="text-white ml-2 w-16 h-16 " />
              </span>
              {/* <NavBar direction={"row"} items={navBaritems} /> */}
              <Outlet />
            </div>
          </ContentLayout>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
