import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Intro } from "~/intro/Intro";
import { getUser } from "~/user/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect("/history");
  }

  return json(null);
};

export default Intro;
