import type { User } from "@prisma/client";
import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getUser } from "~/session.server";

type LoaderData = {
  user: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/search");
  }

  return json<LoaderData>({ user });
};

export default function PrivateRoute() {
  const { user } = useLoaderData();
  const avatarText = [user.firstName.charAt(0), user.lastName.charAt(0)]
    .filter(Boolean)
    .join("");

  return (
    <>
      <header className="navbar justify-between">
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
                <button type="submit">Logout</button>
              </Form>
            </li>
          </ul>
        </div>
      </header>

      <main className="flex flex-col items-center">
        <Outlet />
      </main>
    </>
  );
}
