import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { CiviLegislationData } from "civi-legislation-data";
import React from "react";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import { getLegislations } from "~/legislation/api";
import { RepLevel } from "~/legislation/filters";
import { DynamicPoll } from "~/poll/Poll";
import { getChicagoWard } from "~/representatives/api";
import type { RepresentativesOcIdResult } from "~/representatives/representatives.types";
import { Skin, Spacing } from "~/ui";

interface LoaderData {
  legislation: CiviLegislationData[];
  representative: RepresentativesOcIdResult;
  env: Env;
}
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  const env = getEnv(process.env);

  const representative: RepresentativesOcIdResult = await getChicagoWard(
    id || "",
    env
  );
  const { legislation } = await getLegislations(env, RepLevel.City, "Chicago");

  return json<LoaderData>({ legislation, representative, env });
};

const getOfficialsName = (r: RepresentativesOcIdResult) => r.officials[0].name;

const getOfficeName = (r: RepresentativesOcIdResult) => r.offices[0].name;

const getPhotoUrl = (r: RepresentativesOcIdResult) => r.officials[0].photoUrl;

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  const name = getOfficialsName(data.representative);
  const officeName = getOfficeName(data.representative);
  const title = ` ${name}, ${officeName} | civi`;
  return {
    title,
  };
};

export default function OfficePage() {
  const { legislation, representative } = useLoaderData<LoaderData>();
  const name = getOfficialsName(representative);
  const officeName = getOfficeName(representative);
  const photoUrl =
    getPhotoUrl(representative) ||
    "https://upload.wikimedia.org/wikipedia/en/d/d2/Chicago-muni-flag.png?20060609055709";

  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: "0",
          width: "100vw",
          height: "100vh",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "grayscale(100%) blur(1px)",
        }}
      >
        <div
          style={{
            background: Skin.PrimaryPink,
            margin: Spacing.FOUR,
            paddingTop: Spacing.TWO,
            paddingBottom: Spacing.TWO,
            paddingRight: Spacing.ONE,
            paddingLeft: Spacing.ONE,
            fontSize: "20px",
            color: Skin.White,
            fontWeight: 700,
            maxWidth: "600px",
            textAlign: "center",
            borderRadius: "5px",
          }}
        >
          Hi! We are a non profit, open source project building a way for
          verified residents to give feedback to representatives. <br /> <br />{" "}
          Claim this page by contacting us on the <br />
          <a
            style={{ color: Skin.Black, textDecoration: "underline" }}
            href="https://app.slack.com/client/T04KM9VQY/C047500M5RS"
          >
            Chi Hack Night Slack #civic-engagement-platform
          </a>
        </div>
      </div>
      <div className="p-2 sm:container md:mx-auto">
        <div className="mt-24 bg-white p-8 shadow">
          <div className="mt-15 pb-12 text-center">
            {/* todo: fix height hack */}
            <div className="relative" style={{ height: "130px" }}>
              <div className="absolute inset-x-0 top-0 mx-auto -mt-24 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 shadow-2xl">
                <img style={styles.profileImage} alt={name} src={photoUrl} />
              </div>
            </div>
            <h2 className="text-lg font-bold uppercase text-gray-700">
              {officeName}
            </h2>
            <h1 className="text-4xl font-medium text-gray-700">{name}</h1>
            <div>
              {legislation.map(({ title, sponsors, statusDate }) => (
                <DynamicPoll
                  key={title}
                  pollText={title}
                  subText={sponsors.map((s) => s.name).join(",") || ""}
                  extraText={statusDate}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  profileImage: {
    clipPath: "circle(90px at center)",
    width: "300px",
  },
};
