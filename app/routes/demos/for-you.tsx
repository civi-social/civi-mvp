import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { CiviLegislationData } from "civi-legislation-data";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import { ForYou, forYouData } from "~/for-you";

interface LoaderData {
  legislation: CiviLegislationData[];
  env: Env;
}
export const loader: LoaderFunction = async ({ params }) => {
  const env = getEnv(process.env);

  const legislation = await forYouData(env);

  return json<LoaderData>({ legislation, env });
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

export default function OfficePage() {
  const { legislation } = useLoaderData<LoaderData>();

  return <ForYou legislation={legislation} />;
}
