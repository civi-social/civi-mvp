import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { IntroContent, Progress } from "~app/modules/intro/Intro";
import { NewsletterForm } from "~app/modules/newsletter-form/NewsletterForm";

interface LoaderData {}
// export const loader: LoaderFunction = async ({ request }) => {
//   return json<LoaderData>({});
// };

// interface ActionData {
//   errors?: {};
// }

// export const action: ActionFunction = async ({ request }) => {
//   return json<ActionData>({}, { status: 200 });
// };

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: "Chicago Civi",
    viewport: "width=device-width,initial-scale=1",
    charset: "utf-8",
  };
};

// export default function ForYouPage() {

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-primary-200 p-4">
        <h1 className="text-center text-2xl font-bold">Civi</h1>
        <p className="text-center italic">
          Fostering inclusive, community-based virtual-direct democracy.
        </p>
      </header>
      <main className="p-4">
        <section
          id="AboutUs"
          className="mb-4 rounded-lg bg-zinc-50 p-4 shadow-lg"
        >
          <h2 className="mb-2 text-xl font-bold">About Us</h2>
          <p className="mb-2">
            We are a non-partisan, non-profit, open-source team, focused on
            connecting community members with their representatives to influence
            government.
          </p>
          <p>With Civi, it is easy to </p>
          <ul className="mb-2 list-inside list-disc">
            <li>find and understand the impact of policy decisions</li>
            <li>communicate with representatives to influence decisions</li>
          </ul>
        </section>
        <section id="Demo" className="flex flex-col items-center">
          <h2 className="mt-2 text-xl font-bold">Give it a spin!</h2>
          <p>Explore our initial demo and share any feedback you have.</p>
          <Link
            to="/demos/wizard"
            className="m-6 w-fit rounded-lg bg-secondary-200 p-4 pl-6 pr-6 shadow-lg hover:bg-secondary-400 hover:text-zinc-50 active:bg-zinc-50"
          >
            View our demo.
          </Link>
        </section>
        <NewsletterForm />
        <section
          id="InProgress"
          className="mb-4 rounded-lg bg-zinc-50 p-4 shadow-lg"
        >
          <Progress />
        </section>
      </main>
      <footer className="bg-primary-200 p-4 text-center">
        <button className="rounded bg-primary-600 py-2 px-4 font-bold text-zinc-50 hover:bg-secondary-200 hover:text-gray-800">
          Donate
        </button>
      </footer>
    </div>
  );
};

export default App;
