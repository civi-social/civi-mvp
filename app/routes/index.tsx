import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import HomePage from "~/components/HomePage/HomePage";
import { getUser } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect("/my-reps");
  }

  return json(null);
};

export default HomePage