import type {
  MetaFunction
} from "@remix-run/node";
import { Link } from "@remix-run/react"

import { IntroContent, Progress } from "~app/modules/intro/Intro";

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
    <div className="bg-gray-100 min-h-screen text-gray-800">
      <header className="bg-primary-200 p-4">
        <h1 className="text-2xl font-bold text-center">Civi</h1>
        <p className="italic text-center">Fostering inclusive, community-based virtual-direct democracy.</p>
      </header>
      <main className="p-4">
        <section id="AboutUs" className="bg-zinc-50 rounded-lg shadow-lg p-4 mb-4">
          <h2 className="text-xl font-bold mb-2">About Us</h2>
          <p className="mb-2">We are a non-partisan, non-profit, open-source team, focused on connecting community members with their representatives to influence government.</p>
          <p>With Civi, it is easy to </p>
          <ul className="list-disc list-inside mb-2">
            <li>
            find and understand the impact of policy decisions
            </li>
            <li>
            communicate with representatives to influence decisions
            </li>
          </ul>
        </section>
        <section id="Demo" className="flex flex-col items-center">
          <h2 className="text-xl font-bold mt-2">Give it a spin!</h2>
          <p>Explore our initial demo and share any feedback you have.</p>
          <Link to="/demos/wizard" className="bg-secondary-200 hover:bg-secondary-400 active:bg-zinc-50 rounded-lg shadow-lg p-4 pl-6 pr-6 m-6 w-fit">View our demo.</Link>
        </section>
        <section id="SignUp" className=" p-4 flex flex-col 
                    items-center justify-center">
          <h2 className="text-xl font-bold mb-2 text-center">Like what you see?</h2>
          <p className="italic text-center">Embrace the power of your political voice.</p>
          <p className="italic text-center">Sign up for our mailing list to receive the latest updates.</p>
          <form className="w-full max-w-sm justify-center">
            <div className="flex items-center border-b border-secondary-400 py-2 ">
              <input className="appearance-none bg-transparent w-full text-gray-800 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="email address" aria-label="E-mail Address"/>
              <button className="flex-shrink-0 bg-secondary-400 hover:bg-secondary-200 border-secondary-400 hover:border-secondary-200 text-sm border-4 text-zinc-50 hover:text-gray-800 py-1 px-2 rounded" type="button">
                Sign Up
              </button>
            </div>
          </form>        
        </section>
        <section id="InProgress" className="bg-zinc-50 rounded-lg shadow-lg p-4 mb-4">
          <Progress/>
        </section>
      </main>
      <footer className="bg-primary-200 p-4 text-center">
        <button className="bg-primary-600 hover:bg-secondary-200 text-zinc-50 hover:text-gray-800 font-bold py-2 px-4 rounded">
          Donate
        </button>
      </footer>
    </div>
  );
};

export default App;