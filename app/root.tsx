
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node'
import styles from "./styles/app.css"
import { ContentLayout } from './components/layout/ContentLayout';
import { LockClosedIcon } from '@heroicons/react/outline';

export const meta: MetaFunction = () => {
  return { title: 'Secrets' };
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cobalt">
        <div className="bg-cobalt h-full flex flex-col items-center">
          <ContentLayout className="w-screen mx-96">
            <span className="flex justify-center items-center">
              <h2 className="text-white items-center font-extrabold text-9xl mt-10 mb-10">
                secrets
              </h2>
              <LockClosedIcon className="text-white ml-2 w-16 h-12" />
            </span>
            <Outlet />
          </ContentLayout>
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html >
  );
}

