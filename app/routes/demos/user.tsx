import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/user/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = () => {
  return {
    title: "User Profile",
  };
};

export default function ProfilePage() {
  return (
    <div className="p-16">
      <div className="mt-24 bg-white p-8 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="order-last mt-20 grid grid-cols-3 text-center md:order-first md:mt-0">
            <div>
              <p className="text-xl font-bold text-yellow-700">?</p>
              <p className="text-gray-400">vote streak</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-700">2022</p>
              <p className="text-gray-400">member since</p>
            </div>
            <div>
              <p className="text-xl font-bold text-red-700">no</p>
              <p className="text-gray-400">verified neighbor</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 mx-auto -mt-24 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="mt-32 flex justify-between space-x-8 md:mt-0 md:justify-center">
            <button className="transform rounded bg-blue-400 py-2 px-4 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg">
              Connect
            </button>
            <button className="transform rounded bg-gray-700 py-2 px-4 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg">
              Message
            </button>
          </div>
        </div>

        <div className="mt-20 border-b pb-12 text-center">
          <button className="mb-4 py-2 px-4  font-medium text-indigo-500">
            Do you know Rene? Help them get verified, it's EASY!
          </button>
          <h1 className="text-4xl font-medium text-gray-700">Rene R.</h1>
          <p className="mt-3 font-light text-gray-600">Chicago, Illinois</p>
          <p className="text-black-900 mt-8 font-bold">
            Self-Reported Political Scores:
          </p>
          <p className="mt-2 text-gray-500">
            Importance of Democracy: 9 - Very pro-Democracy{" "}
          </p>
          <p className="mt-2 text-gray-500">Social Views: 10 - Very Liberal </p>
          <p className="mt-2 text-gray-500">
            Engagement: 6 - Somewhat Engaged{" "}
          </p>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p className="text-center font-light text-gray-600 lg:px-16">
            Hi Neighbors! I'm Rene, and I'm excited to be here! I've never been
            very active in politics, but am looking forward to changing that and
            engaging with my neighbors and local officials!
          </p>
        </div>
      </div>
    </div>
  );
}
