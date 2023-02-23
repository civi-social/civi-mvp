import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import { forYouData } from "~/for-you";
import type { LegislationData } from "~/legislation";
import { DataField, ResultCard, Spacing } from "~/ui";

interface LoaderData {
  legislation: LegislationData[];
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

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: "500px",
          alignContent: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        {legislation.map(({ id, title, date, sponsor, link, description }) => (
          <div key={id + title} style={{ marginTop: Spacing.FOUR }}>
            <ResultCard
              title={title}
              subtitle={description}
              channels={
                <>
                  <DataField type="Text" id={id} />
                  {sponsor && <DataField type="Text" id={sponsor} />}
                  <DataField type="Text" id={date} />
                  <DataField type="URL" id={link} />
                </>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
