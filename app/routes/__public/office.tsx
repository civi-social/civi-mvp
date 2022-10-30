import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import React from "react";

export const loader: LoaderFunction = async ({ request }) => {
  return json({});
};

interface ActionData {
  errors?: {};
}

export const action: ActionFunction = async ({ request }) => {
  return json<ActionData>({}, { status: 200 });
};

export const meta: MetaFunction = () => {
  return {
    title: "51st Ward Alderperson Office, Brian Burns",
  };
};

export default function OfficePage() {
  return (
    <div className="p-2 sm:container md:mx-auto">
      <div className="mt-24 bg-white p-8 shadow">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="mt-15 order-last grid grid-cols-3 text-center md:order-first md:mt-0">
            <div>
              <p className="text-xl font-bold text-yellow-700">93%</p>
              <p className="text-gray-400">Votes in line with Polls</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-500">Nov 2022</p>
              <p className="text-gray-400">next election</p>
            </div>
            <div>
              <p className="text-xl font-bold text-green-700">Yes</p>
              <p className="text-gray-400">Civi User</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 top-0 mx-auto -mt-24 flex h-48 w-48 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 shadow-2xl">
              <img
                style={styles.profileImage}
                alt="Brian Burns, 51st Ward Alderperson"
                src="https://s3.amazonaws.com/ballotpedia-api4/files/thumbs/200/300/BrianBurns1.jpg"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between md:mt-0 md:justify-center">
            <div className="inline-block rounded border p-4">
              <div className="text-black-900 font-bold">
                Office Responsibilities
              </div>
              {[
                "Represent Interest of the 51st Ward",
                "Chicago City Council Legislator",
              ].map((text) => (
                <p key={text} className="mt-2 text-gray-500">
                  {text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-15 pb-12 text-center">
          <h2 className="text-lg font-bold uppercase text-gray-700">
            Office of the 51st Ward
          </h2>
          <h1 className="text-4xl font-medium text-gray-700">
            Alderperson Brian Burns
          </h1>
          <p className="mt-2 font-light text-gray-600">Chicago, Illinois</p>
          <div className="mb-2 inline-block transform rounded bg-green-600 py-2 px-4 font-medium uppercase text-white shadow transition hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg">
            This Office Represents You
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  profileImage: {
    clipPath: "circle(90px at center)",
  },
};
