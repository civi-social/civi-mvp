import { json, redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { FaUserCircle } from "react-icons/fa";
import { getUserId } from "~/session.server";
import { AddressLookup } from "~/components";
import type { Env } from "~/config";
import { getEnv } from "~/config";

type LoaderData = {
  env: Env;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  const env = getEnv(process.env);
  return json<LoaderData>({ env });
};

export default function PublicRoute() {
  const { env } = useLoaderData<LoaderData>();
  const { pathname } = useLocation();
  const isSearch = pathname === "/search";

  return (
    <>
      <header
        className={`navbar bg-indigo-500 ${
          isSearch ? "justify-between" : "justify-end"
        }`}
      >
        {isSearch && (
          <div className="form-control">
            <AddressLookup env={env} />
          </div>
        )}
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
              <Link to={{ pathname: "/join" }} replace>
                Register
              </Link>
            </li>
            <li>
              <Link to={{ pathname: "/login" }} replace>
                Log In
              </Link>
            </li>
          </ul>
        </div>
      </header>

      <main className="flex flex-1 justify-center">
        <Outlet />
      </main>
    </>
  );
}
