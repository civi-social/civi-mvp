import type { User } from "@prisma/client";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { LevelsNav, Loading, Representatives } from "~/components";
import type { Bill } from "~/entities/bills";
import type { RepresentativesResult } from "~/entities/representatives";
import { RepLevel } from "~/types";
import { getBills, getRepresentatives } from "~/utils";
import { getUser } from "~/session.server";

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
  const avatarText = [user.firstName.charAt(0), user.lastName.charAt(0)]
    .filter(Boolean)
    .join("");

  return (
    <>
      <header className="navbar bg-indigo-500 justify-between">
        <div className="form-control mr-5 text-slate-300">{user.address}</div>
        <div className="dropdown-end dropdown">
          <div
            tabIndex={0}
            className="avatar placeholder btn btn-ghost btn-circle"
          >
            <div className="w-12 rounded-full bg-base-200 text-xl text-indigo-500">
              <span>{avatarText}</span>
            </div>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li>
              <Link to="/">Representatives</Link>
            </li>
            <li>
              <Link to="/history">Vote History</Link>
            </li>
            <li>
              <Form action="/logout" method="post">
                <button type="submit" className="w-full text-left">
                  Logout
                </button>
              </Form>
            </li>
          </ul>
        </div>
      </header>
      <main className="flex grow flex-col">
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
      </main>
    </>
  );
}
