
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Meta />
        <Links />
      </head>
      <body className="bg-cobalt overflow-y-hidden">
        <div className="w-full flex flex-col items-center justify-start mt-10">
          <ContentLayout className="py-6 mx-96">
            <span className="flex justify-center items-center mb-5">
              <h2 className="text-white text-8xl lg:text-9xl items-center font-extrabold">
                secrets
              </h2>
              <LockClosedIcon className="text-white ml-2 w-16 h-16" />
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

