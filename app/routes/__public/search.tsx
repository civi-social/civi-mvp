import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useTransition } from "@remix-run/react";
import { getLegislations, getRepresentatives } from "~/api";
import {
  Instructions,
  LevelsNav,
  Loading,
  Representatives,
} from "~/components";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import type { LegislationData } from "~/entities/legislation";
import { getLocale } from "~/entities/legislation";
import type { RepresentativesResult } from "~/entities/representatives";
import { RepLevel } from "~/types";

type LoaderData = {
  legislation: LegislationData[];
  address: string | null;
  level: RepLevel;
  representatives: RepresentativesResult | null;
  env: Env;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const env = getEnv(process.env);

  const address = url.searchParams.get(env.FORMATTED_ADDRESS_SEARCH_KEY);
  const level = (url.searchParams.get("level") as RepLevel) ?? RepLevel.City;

  let representatives: RepresentativesResult | null = null;
  let legislation: LegislationData[] = [];
  if (address) {
    representatives = await getRepresentatives(address, env);
    legislation = await getLegislations(env, level, getLocale(address));
  }

  return json<LoaderData>({
    legislation,
    representatives,
    env,
    level,
    address,
  });
};

export default function SearchPage() {
  const { legislation, representatives, env, level, address } =
    useLoaderData<LoaderData>();
  const transition = useTransition();

  return address !== null ? (
    <div className="flex w-full flex-col items-center gap-y-6">
      <LevelsNav env={env} />
      {transition.state === "loading" ? (
        <Loading />
      ) : (
        <Representatives
          level={level}
          formattedAddress={address}
          representatives={representatives}
          legislation={legislation}
        />
      )}
    </div>
  ) : (
    <div className="flex w-full flex-col gap-y-6">
      <Instructions />
    </div>
  );
}
