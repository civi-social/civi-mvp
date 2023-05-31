import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ForYouShell } from "~/for-you";

interface LoaderData {}
export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({});
};

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: "Chicago Civi",
    viewport: "width=device-width,initial-scale=1",
    charset: "utf-8",
  };
};

export default function ForYouPage() {
  const {} = useLoaderData<LoaderData>();
  return <ForYouShell left={<></>} right={<></>} />;
}
