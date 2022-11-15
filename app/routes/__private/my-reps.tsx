import type { User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { LevelsNav, Loading, Representatives } from "~/components";
import type { Bill } from "~/entities/bills";
import type { RepresentativesResult } from "~/entities/representatives";
import { getUser } from "~/session.server";
import { RepLevel } from "~/types";
import { getBills, getRepresentatives } from "~/utils";

type LoaderData = {
  user: User;
  bills: Bill[];
  representatives: RepresentativesResult | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    return redirect("/search");
  }
  const address = user.address;
  let representatives: RepresentativesResult | null = null;
  let bills: Bill[] = [];
  if (address) {
    representatives = await getRepresentatives(address);
    const locale = /Chicago, IL/gi.test(address) ? "Chicago" : null;
    bills = await getBills(locale);
  }

  return json({ user, bills, representatives });
};

export default function HomePage() {
  const { user, bills, representatives } = useLoaderData<LoaderData>();
  const transition = useTransition();
  const [searchParams] = useSearchParams();
  const level = (searchParams.get("level") as RepLevel) ?? RepLevel.City;

  return (
    <div className="flex w-full flex-col items-center gap-y-6">
      <LevelsNav />
      {transition.submission ? (
        <Loading />
      ) : (
        <Representatives
          level={level}
          formattedAddress={user.address}
          representatives={representatives}
          bills={bills}
        />
      )}
    </div>
  );
}
