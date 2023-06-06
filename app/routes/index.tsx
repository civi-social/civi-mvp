import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { Progress } from "~app/modules/intro/Intro";
import { NewsletterForm } from "~app/modules/newsletter-form/NewsletterForm";
import civiLogo from "~/app-shell/assets/civi-temp-logo.png";

export const meta: MetaFunction = () => {
  return {
    title: "Chicago Civi",
    viewport: "width=device-width,initial-scale=1",
    charset: "utf-8",
  };
};

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary-200 p-4">
        <CenteredContent>
          <div className="mb-2 flex justify-center text-center">
            <img src={civiLogo} alt="Civi's Logo" style={{ height: "30px" }} />{" "}
          </div>
          <p className="text-center italic">
            Fostering inclusive, community-based, virtual-direct democracy.
          </p>
        </CenteredContent>
      </header>
      <main className="p-4">
        <CenteredContent>
          <Card>
            <section id="AboutUs">
              <h2 className="mb-2 font-serif text-xl font-bold">About Us</h2>
              <p className="mb-2 max-w-lg">
                We are a non-partisan, non-profit, open-source team, focused on
                connecting community members with their representatives to
                influence government.
              </p>
              <p className="mb-2 font-serif text-lg">
                With Civi, it is easy to:{" "}
              </p>
              <ul className="mb-2 ml-6 list-inside list-disc">
                <li>find and understand the impact of policy decisions</li>
                <li>communicate with representatives to influence decisions</li>
              </ul>
            </section>
          </Card>
        </CenteredContent>
        <CenteredContent>
          <Card>
            <section id="Demo" className="flex flex-col items-center">
              <h2 className="mt-2 font-serif text-xl font-bold">
                Give it a spin!
              </h2>
              <p>Explore our initial demo and share any feedback you have.</p>
              <Link
                to="/demos/wizard"
                className="m-3 w-fit rounded-md bg-secondary-200 py-2 px-6 font-bold uppercase text-black/60 shadow-md hover:bg-secondary-400 hover:text-zinc-50 active:bg-zinc-50"
              >
                view our demo
              </Link>
            </section>
          </Card>
        </CenteredContent>
        <CenteredContent>
          <Card>
            <NewsletterForm />
          </Card>
        </CenteredContent>
        <CenteredContent>
          <Card>
            <section id="Demo" className="flex max-w-lg flex-col items-center">
              <h2 className="mt-2 font-serif text-xl font-bold">
                Want to see more?
              </h2>
              <p>
                See our previous demo, where you can explore AI summarized
                active city, state, and national legislation.
              </p>
              <Link
                to="/explore"
                className="m-3 w-fit rounded-md bg-secondary-200 py-2 px-6  font-bold uppercase text-black/60 opacity-70  hover:bg-secondary-400 hover:text-zinc-50 active:bg-zinc-50"
              >
                explore current legislation
              </Link>
            </section>
          </Card>
        </CenteredContent>
        <CenteredContent>
          <Card>
            <section id="InProgress">
              <Progress />
            </section>
          </Card>
        </CenteredContent>
      </main>
      <footer className="bg-primary-200 p-4 text-center">
        <CenteredContent>
          {/* <button className="rounded bg-primary-600 py-2 px-4 font-bold text-zinc-50 hover:bg-secondary-200 hover:text-gray-800">
            Donate
          </button> */}
        </CenteredContent>
      </footer>
    </div>
  );
};

const CenteredContent: React.FC = ({ children }) => (
  <div className="flex w-full flex-col items-center">
    <div className="max-w-3xl">{children}</div>
  </div>
);

const Card: React.FC = ({ children }) => (
  <div className="mx-4 mb-6 rounded-sm bg-white p-4 shadow-md">{children}</div>
);

export default App;
