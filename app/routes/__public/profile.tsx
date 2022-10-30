import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { getUserId } from "~/session.server";

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

  return json<ActionData>(
    {},
    { status: 200 }
  );

};

export const meta: MetaFunction = () => {
  return {
    title: "User Profile",
  };
};

export default function ProfilePage() {

  return (
    <div className="p-16">
      <div className="p-8 bg-white shadow mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
            <div>
              <p className="font-bold text-yellow-700 text-xl">?</p>
              <p className="text-gray-400">vote streak</p>
            </div>
            <div>
              <p className="font-bold text-green-700 text-xl">2022</p>
              <p className="text-gray-400">member since</p>
            </div>
            <div>
              <p className="font-bold text-red-700 text-xl">no</p>
              <p className="text-gray-400">verified neighbor</p>
            </div>

          </div>
          <div className="relative">

            <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
            <button
              className="text-white py-2 px-4 uppercase rounded bg-blue-400 hover:bg-blue-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Connect
            </button>
            <button
              className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-gray-800 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
            >
              Message
            </button>
          </div>
        </div>

        <div className="mt-20 text-center border-b pb-12">
          <button
            className="text-indigo-500 py-2 px-4  font-medium mb-4"
          >
            Do you know Rene?  Help them get verified, it's EASY!
          </button>
          <h1 className="text-4xl font-medium text-gray-700">Rene R.</h1>
          <p className="font-light text-gray-600 mt-3">Chicago, Illinois</p>
          <p className="mt-8 text-black-900 font-bold">Self-Reported Political Scores:</p>
          <p className="mt-2 text-gray-500">Importance of Democracy: 9 - Very pro-Democracy  </p>
          <p className="mt-2 text-gray-500">Social Views: 10 - Very Liberal </p>
          <p className="mt-2 text-gray-500">Engagement: 6 - Somewhat Engaged </p>
        </div>

        <div className="mt-12 flex flex-col justify-center">
          <p className="text-gray-600 text-center font-light lg:px-16">Hi Neighbors! I'm Rene, and I'm excited to be here!  I've never been very actvie in politics, but am looking forward to changing that and engaging with my neighbors and local officials!</p>
        </div>

      </div>
    </div>
  );
}
