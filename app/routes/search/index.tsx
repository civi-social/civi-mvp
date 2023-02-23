import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useTransition } from "@remix-run/react";
import { FaUserCircle } from "react-icons/fa";
import {
  AddressLookup,
  Instructions,
  LevelsNav,
  Loading,
  Representatives,
} from "~/components";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import type { LegislationData } from "~/modules/legislation";
import { getLegislations } from "~/modules/legislation/api";
import { getRepresentatives } from "~/modules/representatives/api";
import { getLocale, RepLevel } from "~/modules/levels";
import type { RepresentativesResult } from "~/modules/representatives";

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

const Header = ({ env }: { env: Env }) => {
  return (
    <header className="navbar justify-between bg-indigo-500">
      <div className="form-control">
        <AddressLookup env={env} />
      </div>
      <div className="dropdown-end dropdown">
        <label
          tabIndex={0}
          className="avatar placeholder btn btn-ghost btn-circle"
        >
          <div className="w-12 rounded-full text-4xl text-slate-200">
            <FaUserCircle />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
        >
          <li>
            <Link to={{ pathname: "/auth/join" }} replace>
              Register
            </Link>
          </li>
          <li>
            <Link to={{ pathname: "/auth/login" }} replace>
              Log In
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default function SearchPage() {
  const { legislation, representatives, env, level, address } =
    useLoaderData<LoaderData>();
  const transition = useTransition();

  const contents =
    address !== null ? (
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

  return (
    <>
      <Header env={env} />
      <main className="flex flex-1 justify-center">{contents}</main>
    </>
  );
}
