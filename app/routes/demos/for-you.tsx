import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import type { ForYouBill } from "~/for-you";
import { ForYou, forYouData } from "~/for-you";

interface LoaderData {
  legislation: ForYouBill[];
  tags: string[];
  env: Env;
}
export const loader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const address = url.searchParams.get("address");
  const level = url.searchParams.get("tags");

  const env = getEnv(process.env);

  const { legislation, tags } = await forYouData(env);

  return json<LoaderData>({ legislation, env, tags });
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
  };
};

export default function ForYouPage() {
  const { legislation, tags } = useLoaderData<LoaderData>();
  return <ForYou tags={tags} legislation={legislation} />;
}
