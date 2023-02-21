import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";
import { getLegislations } from "~/api";
import Bills from "~/components/Bills/Bills";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import type { LegislationData } from "~/entities/legislation";
import { RepLevel } from "~/types";

interface LoaderData {
  legislation: LegislationData[];
  env: Env;
}
export const loader: LoaderFunction = async ({ params }) => {
  const env = getEnv(process.env);

  const city: LegislationData[] = await getLegislations(
    env,
    RepLevel.City,
    "Chicago"
  );
  const state: LegislationData[] = await getLegislations(
    env,
    RepLevel.State,
    "Chicago"
  );

  const national: LegislationData[] = await getLegislations(
    env,
    RepLevel.National,
    "Chicago"
  );

  const legislation = [...city, ...state, ...national];

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

  return (
    <div>
      <Bills bills={legislation} />
      {/* {legislation.map((bill) => {
        return (
          <div key={bill.id + bill.title}>{JSON.stringify(bill, null, 2)}</div>
        );
      })} */}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  profileImage: {
    clipPath: "circle(90px at center)",
    width: "300px",
  },
};
