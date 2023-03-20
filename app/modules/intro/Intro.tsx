import civiLogo from "~/app-shell/assets/civi-temp-logo.png";
import { CardSection, CardTitle, Spacing } from "~/ui";
import { useDemoContent } from "../demos/Demos";

export const IntroContent = () => {
  return (
    <div className="flex flex-col rounded text-white">
      <div className="flex justify-start pb-2">
        <img
          src={civiLogo}
          alt="Civi Logo"
          className="h-8"
          style={{
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>
      <div className="pt-2 font-serif text-3xl">Chicago!</div>
      <div className="mt-4 font-serif text-2xl font-semibold leading-tight ">
        We Want To Help You Engage With The Legislation That Impacts You
      </div>
    </div>
  );
};

const Progress = () => {
  const { enableDemo } = useDemoContent();
  return (
    <CardSection>
      <CardTitle>
        Progress{" "}
        <span className="text-sm font-light">[last updated march 17 2022]</span>
      </CardTitle>
      <ul
        style={{
          margin: Spacing.ONE,
          padding: Spacing.ONE,
        }}
      >
        <li>✅ Find your local, state, and national representative</li>
        <li>✅ Find active Chicago legislation</li>
        <li>✅ Find active Illinois legislation</li>
        <li>✅ Find active National legislation</li>
        <li>✅ Get legislation summarized by AI</li>
        <li>✅ New feed experience</li>
        <li>⏺ Get Chicago resident summary of active legislation</li>
        <li onClick={() => enableDemo()}>⏺ Vote on active legislation</li>
      </ul>
    </CardSection>
  );
};

const HelpUs = () => {
  return (
    <CardSection>
      <CardTitle>Help Us Build It!</CardTitle>
      <div>
        We work within the{" "}
        <a
          className="text-blue-500 underline visited:text-purple-600 hover:text-blue-600"
          href="https://chihacknight.org"
        >
          Chi Hack Night
        </a>{" "}
        community.{" "}
        <a
          className="text-blue-500 underline visited:text-purple-600 hover:text-blue-600"
          href="https://chihacknight.slack.com/archives/C047500M5RS"
        >
          Come join the Slack to see how you can contribute.
        </a>
      </div>
    </CardSection>
  );
};

export const CiviUpdates = () => {
  return (
    <>
      <CardSection>
        <div className="text-base font-normal text-gray-700">
          We are a non-profit, open source community looking to build a way for
          you connect to your representative. <br />
          <br /> Vote on legislation they will vote on, and let them know what
          you think.
        </div>
      </CardSection>
      <Progress />
      <HelpUs />
      <CardSection>
        <CardTitle>Follow Us On Social Media</CardTitle>
        <div>
          ...LOL 😬 We currently don't have any social media accounts.{" "}
          <a
            className="text-blue-500 underline visited:text-purple-600 hover:text-blue-600"
            href="https://chihacknight.slack.com/archives/C047500M5RS/p1675148248890889"
          >
            But we could love your help to start one!
          </a>
        </div>
      </CardSection>
    </>
  );
};
