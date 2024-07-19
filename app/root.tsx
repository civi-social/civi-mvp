import type { LinksFunction } from "@remix-run/server-runtime";
import mainStylesheetUrl from "~/app-shell/css/main.css";
import tailwindStylesheetUrl from "~/app-shell/css/tailwind.css";

export * from "~/app-shell/Root";
export { default } from "~/app-shell/Root";

// Hack: something in Remix is preventing these from running when defined in app-shell.
// TODO: If remix ever fixes, this, this back to app shell.
export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: mainStylesheetUrl },
    { rel: "manifest", href: "windycivi.webmanifest" },
  ];
};
