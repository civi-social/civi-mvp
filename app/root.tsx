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
import invariant from "tiny-invariant";

import tailwindStylesheetUrl from "~/styles/tailwind.css";
import type { Config } from "~/types";
import AppProvider from "./context/AppProvider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Project Socrates",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  invariant(
    typeof process.env.GOOGLE_API_KEY === "string",
    "⛔️ GOOGLE_API_KEY env var not set."
  );
  const apiKey = process.env.GOOGLE_API_KEY;
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
