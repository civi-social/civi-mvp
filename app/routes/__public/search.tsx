import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import {
  Instructions,
  LevelsNav,
  Loading,
  Representatives,
} from "~/components";
import type { Bill } from "~/entities/bills";
import type { RepresentativesResult } from "~/entities/representatives";
import { RepLevel } from "~/types";
import { getBills, getRepresentatives } from "~/utils";
import type { Env } from "~/config";
import { getEnv } from "~/config";

type LoaderData = {
  bills: Bill[];
  representatives: RepresentativesResult | null;
  env: Env;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const env = getEnv(process.env);
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;

  const address = url.searchParams.get(addressKey);
  let representatives: RepresentativesResult | null = null;
  let bills: Bill[] = [];
  if (address) {
    // const previousSearchKey = await client.json.get("previous_search", {
    //   path: ".address",
    // });
    // console.log("previous_search:", previousSearchKey);
    // if (previousSearchKey === address) {
    //   const previousBills = await client.json.get("previous_search", {
    //     path: ".bills",
    //   });
    //   const previousRepresentatives = await client.json.get("previous_search", {
    //     path: ".representatives",
    //   });
    //   console.log("previousBills:", previousBills);
    //   console.log("previousRepresentatives:", previousRepresentatives);
    // }
    representatives = await getRepresentatives(address, env);
    const locale = /Chicago, IL/gi.test(address) ? "Chicago" : null;
    bills = await getBills(locale);
  }

  return json({ bills, representatives, env });
};

export default function SearchPage() {
  const { bills, representatives, env } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const addressKey = env.FORMATTED_ADDRESS_SEARCH_KEY;
  const [searchParams] = useSearchParams();
  const formattedAddress = searchParams.get(addressKey);
  const level = (searchParams.get("level") as RepLevel) ?? RepLevel.City;
  const hasAddress = Boolean(formattedAddress);

  return hasAddress ? (
    <div className="flex w-full flex-col items-center gap-y-6">
      <LevelsNav env={env} />
      {transition.state === "loading" ? (
        <Loading />
      ) : (
        <Representatives
          level={level}
          formattedAddress={formattedAddress}
          representatives={representatives}
          bills={bills}
        />
      )}
    </div>
  ) : (
    <div className="flex w-full flex-col gap-y-6">
      <Instructions />
    </div>
  );
}
