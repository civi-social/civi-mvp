import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import type { CiviLegislationData } from "civi-legislation-data";
import { FaUserCircle } from "react-icons/fa";
import type { Env } from "~/config";
import { getEnv } from "~/config";
import { getLegislations } from "~/legislation/api";
import LevelsNav from "~/levels/react/LevelsNav";
import type { RepresentativesResult } from "~/representatives";
import { getRepresentatives } from "~/representatives/api";
import Representatives from "~/representatives/react/Representatives";
import { AddressLookup, Instructions, Loading } from "~/ui";
import { DataStores, RepLevel } from "~app/modules/legislation/filters";

type LoaderData = {
  legislation: CiviLegislationData[];
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
  let legislation: CiviLegislationData[] = [];
  if (address) {
    representatives = await getRepresentatives(address, env);
    const res = await getLegislations(DataStores.Chicago);
    legislation = res.legislation;
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
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <header className="navbar justify-between bg-indigo-500">
      <div className="form-control">
        <AddressLookup
          onClear={() => {
            setSearchParams(new URLSearchParams());
          }}
          onPlaceSelected={(formatted_address) => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString()
            );
            formatted_address
              ? newSearchParams.set("address", formatted_address)
              : newSearchParams.delete("address");
            setSearchParams(newSearchParams);
          }}
        />
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
