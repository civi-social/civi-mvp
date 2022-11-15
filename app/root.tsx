import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
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

import mainStylesheetUrl from "~/styles/main.css";
import tailwindStylesheetUrl from "~/styles/tailwind.css";
import type { Config } from "~/types";
import AppProvider from "./context/AppProvider";
import { getEnv } from "~/config";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: mainStylesheetUrl },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Civi",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const env = getEnv();
  const apiKey = env.GOOGLE_API_KEY;
  return json<Config>({
    apiKey,
  });
};

export const unstable_shouldReload = () => false;

export default function App() {
  const data = useLoaderData<Config>();

  return (
    <html lang="en" className="h-full" data-theme="light">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex h-full flex-col">
        <AppProvider value={data}>
          <Outlet />
        </AppProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
